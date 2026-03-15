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

        // Workflow shortcuts — delegate to claude CLI
        Some(Commands::Run { command, args, print }) => {
            commands::run::run(command, args, print)?
        }
        Some(Commands::Task { args }) => {
            commands::run::run("task".into(), args, false)?
        }
        Some(Commands::Feature { args }) => {
            commands::run::run("feature".into(), args, false)?
        }
        Some(Commands::Mission { args }) => {
            commands::run::run("mission".into(), args, false)?
        }
        Some(Commands::Commit { args }) => {
            commands::run::run("commit".into(), args, false)?
        }
        Some(Commands::Ship { args }) => {
            commands::run::run("ship".into(), args, false)?
        }
        Some(Commands::Validate) => {
            commands::run::run("validate".into(), vec![], true)?
        }
        Some(Commands::Debug { args }) => {
            commands::run::run("debug".into(), args, false)?
        }

        None => commands::status::run()?,
    }

    Ok(())
}
