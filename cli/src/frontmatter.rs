use anyhow::{Context, Result};
use serde::Deserialize;
use std::path::Path;

#[derive(Debug, Deserialize, Default)]
#[allow(dead_code)]
pub struct Frontmatter {
    pub name: Option<String>,
    pub description: Option<String>,
    pub model: Option<String>,
    pub tools: Option<String>,
    #[serde(rename = "maxTurns")]
    pub max_turns: Option<u32>,
    #[serde(rename = "argument-hint")]
    pub argument_hint: Option<String>,
    #[serde(rename = "user-invocable")]
    pub user_invocable: Option<bool>,
}

impl Frontmatter {
    pub fn parse(content: &str) -> Result<Self> {
        let content = content.trim();
        if !content.starts_with("---") {
            return Ok(Self::default());
        }

        let rest = &content[3..];
        let end = rest.find("---").context("No closing --- in frontmatter")?;
        let yaml = &rest[..end];

        serde_yaml::from_str(yaml).context("Invalid YAML in frontmatter")
    }

    pub fn from_file(path: &Path) -> Result<Self> {
        let content = std::fs::read_to_string(path)
            .with_context(|| format!("Could not read {}", path.display()))?;
        Self::parse(&content)
    }
}
