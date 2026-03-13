use anyhow::{Context, Result};
use std::fs;
use std::os::unix::fs as unix_fs;
use std::path::Path;

use crate::types::LinkStatus;

/// Create a symlink, removing existing symlink if present.
/// Returns false if a non-symlink file exists (conflict).
pub fn create(source: &Path, dest: &Path) -> Result<bool> {
    if dest.is_symlink() {
        fs::remove_file(dest)
            .with_context(|| format!("Could not remove existing symlink: {}", dest.display()))?;
    } else if dest.exists() {
        return Ok(false); // conflict — non-symlink exists
    }

    // Ensure parent directory exists
    if let Some(parent) = dest.parent() {
        fs::create_dir_all(parent)?;
    }

    unix_fs::symlink(source, dest)
        .with_context(|| format!("Could not create symlink: {} → {}", dest.display(), source.display()))?;

    Ok(true)
}

/// Remove a symlink if it exists and is a symlink.
pub fn remove(path: &Path) -> Result<bool> {
    if path.is_symlink() {
        fs::remove_file(path)?;
        Ok(true)
    } else {
        Ok(false)
    }
}

/// Check the link status of a destination path relative to an expected source.
pub fn check(source: &Path, dest: &Path) -> LinkStatus {
    if !dest.is_symlink() && !dest.exists() {
        return LinkStatus::Missing;
    }

    if dest.is_symlink() {
        match fs::read_link(dest) {
            Ok(target) => {
                if target == source {
                    if source.exists() {
                        LinkStatus::Linked
                    } else {
                        LinkStatus::Broken
                    }
                } else {
                    LinkStatus::Conflict(format!("points to {}", target.display()))
                }
            }
            Err(_) => LinkStatus::Broken,
        }
    } else {
        LinkStatus::Conflict("non-symlink file exists".to_string())
    }
}

