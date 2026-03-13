mod cli;
mod commands;
mod config;
mod frontmatter;
mod symlink;
mod types;
mod ui;

use anyhow::Result;
use cli::{Cli, Commands};

fn main() -> Result<()> {
    let cli = Cli::parse_args();

    match cli.command {
        Some(Commands::Install) => commands::install::run()?,
        Some(Commands::Uninstall) => commands::uninstall::run()?,
        Some(Commands::List { kind }) => commands::list::run(kind)?,
        Some(Commands::Add { kind, name }) => commands::add::run(kind, name)?,
        Some(Commands::Doctor) => commands::doctor::run()?,
        Some(Commands::Template { action }) => commands::template::run(action)?,
        Some(Commands::Version) => commands::version::run()?,
        None => commands::status::run()?,
    }

    Ok(())
}
