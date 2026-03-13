use anyhow::Result;
use owo_colors::OwoColorize;
use crate::config::TaiConfig;

pub fn run() -> Result<()> {
    let config = TaiConfig::detect()?;
    let version = config.version();

    println!();
    println!("  {} {}",
        "◆ tai".cyan().bold(),
        format!("v{version}").bold()
    );
    println!("  {}  {}", "root".dimmed(), config.tai_root.display());
    println!("  {}  {}", "home".dimmed(), config.claude_dir.display());
    println!();

    Ok(())
}
