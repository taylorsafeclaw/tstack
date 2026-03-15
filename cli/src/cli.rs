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

    // ── Workflow shortcuts (invoke tai slash commands via claude CLI) ──────

    /// Run any tai slash command via the claude CLI
    Run {
        /// Command name — e.g. task, feature, commit, ship, validate, debug
        command: String,
        /// Arguments forwarded to the slash command
        #[arg(trailing_var_arg = true, allow_hyphen_values = true)]
        args: Vec<String>,
        /// Non-interactive print mode (streams output, then exits)
        #[arg(short, long)]
        print: bool,
    },
    /// Quick atomic change → commit  [alias: tai run task]
    Task {
        #[arg(trailing_var_arg = true, allow_hyphen_values = true)]
        args: Vec<String>,
    },
    /// Full feature pipeline → PR  [alias: tai run feature]
    Feature {
        #[arg(trailing_var_arg = true, allow_hyphen_values = true)]
        args: Vec<String>,
    },
    /// Start a multi-feature mission  [alias: tai run mission]
    Mission {
        #[arg(trailing_var_arg = true, allow_hyphen_values = true)]
        args: Vec<String>,
    },
    /// Validate + commit  [alias: tai run commit]
    Commit {
        #[arg(trailing_var_arg = true, allow_hyphen_values = true)]
        args: Vec<String>,
    },
    /// Full pipeline + PR  [alias: tai run ship]
    Ship {
        #[arg(trailing_var_arg = true, allow_hyphen_values = true)]
        args: Vec<String>,
    },
    /// Lint + build + test  [alias: tai run validate]
    Validate,
    /// Debug + fix an error  [alias: tai run debug]
    Debug {
        #[arg(trailing_var_arg = true, allow_hyphen_values = true)]
        args: Vec<String>,
    },
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
        /// Template name (e.g., example)
        name: String,
    },
    /// List available templates
    List,
}
