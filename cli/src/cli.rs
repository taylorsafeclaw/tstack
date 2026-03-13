use clap::{Parser, Subcommand, ValueEnum};

#[derive(Parser)]
#[command(name = "tai", about = "CLI for the tai dev framework", version)]
pub struct Cli {
    #[command(subcommand)]
    pub command: Option<Commands>,
}

impl Cli {
    pub fn parse_args() -> Self {
        <Self as Parser>::parse()
    }
}

#[derive(Subcommand)]
pub enum Commands {
    /// Symlink commands/agents/skills to ~/.claude/
    Install,
    /// Remove all tai symlinks from ~/.claude/
    Uninstall,
    /// List installed items
    List {
        /// What to list (defaults to all)
        #[arg(value_enum, default_value = "all")]
        kind: ListKind,
    },
    /// Scaffold a new command, agent, or skill
    Add {
        /// Type of item to create
        #[arg(value_enum)]
        kind: AddKind,
        /// Name (without tai- prefix)
        name: String,
    },
    /// Run diagnostics on the tai installation
    Doctor,
    /// Manage project templates
    Template {
        #[command(subcommand)]
        action: TemplateAction,
    },
    /// Print version and build info
    Version,
}

#[derive(ValueEnum, Clone)]
pub enum ListKind {
    Commands,
    Agents,
    Skills,
    Hooks,
    All,
}

#[derive(ValueEnum, Clone)]
pub enum AddKind {
    Command,
    Agent,
    Skill,
}

#[derive(Subcommand)]
pub enum TemplateAction {
    /// Install a project template
    Install {
        /// Template name (e.g., safeclaw)
        name: String,
    },
    /// List available templates
    List,
}
