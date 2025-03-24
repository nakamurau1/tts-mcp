# Memory Bank Guide

This guide explains the purpose and contents of each file in the Memory Bank. The Memory Bank is a structured documentation system that allows me (Cline) to maintain continuity and consistency across development sessions by preserving project knowledge.

## Core Memory Bank Files

### 1. `projectbrief.md`
**Purpose**: Foundation document that shapes all other files and defines the core project requirements and goals.

**Contents**:
- Project overview and description
- Core functional and non-functional requirements
- Project goals and objectives
- Project scope (in-scope and out-of-scope items)

**When to Update**: When project goals or requirements change significantly.

### 2. `productContext.md`
**Purpose**: Explains why this project exists, the problems it solves, and how it should work from a user perspective.

**Contents**:
- Problem statement
- User needs and pain points
- Solution overview
- User experience goals
- Target users
- Success metrics

**When to Update**: When gaining new insights about users or business requirements.

### 3. `systemPatterns.md`
**Purpose**: Documents the system architecture, key technical decisions, design patterns, and component relationships.

**Contents**:
- System architecture diagram
- Key components and their responsibilities
- Data flow descriptions
- Design patterns used in the implementation
- Error handling strategy
- Extension points

**When to Update**: When architecture changes or new patterns are introduced.

### 4. `techContext.md`
**Purpose**: Describes the technologies used, development setup, technical constraints, and dependencies.

**Contents**:
- Technology stack
- Dependencies and versions
- Development environment setup
- Build and deployment processes
- Integration points
- Technical constraints
- File structure
- Testing strategy

**When to Update**: When adding new technologies or changing technical approaches.

### 5. `activeContext.md`
**Purpose**: Captures the current work focus, recent changes, next steps, and active decisions.

**Contents**:
- Current focus areas
- Recent changes to the project
- Active decisions and their rationales
- Next steps (short-term, medium-term, long-term)
- Current challenges
- Integration considerations

**When to Update**: Frequently, as the active work context changes.

### 6. `progress.md`
**Purpose**: Tracks what works, what's left to build, current status, and known issues.

**Contents**:
- Current project status
- Implemented features checklist
- Known issues and limitations
- Testing status
- Documentation status
- Future work items
- Release history
- Maintenance tasks

**When to Update**: After completing features or when status changes.

## Additional Files

### `.clinerules` (in project root)
**Purpose**: Captures project-specific patterns, preferences, and guidelines that help me work more effectively.

**Contents**:
- Project patterns and coding standards
- Naming conventions
- Project structure guidance
- Operational guidelines
- Common development tasks
- Troubleshooting guidelines
- Performance considerations

**When to Update**: When discovering new project patterns or conventions.

## Using the Memory Bank

1. **At Session Start**: I will read all Memory Bank files to understand the project
2. **During Development**: Reference specific files as needed for context
3. **After Significant Changes**: Update the relevant Memory Bank files
4. **When Requested**: When asked to "update memory bank", I will review all files

The Memory Bank system ensures that I can pick up exactly where we left off, even if significant time has passed between sessions, maintaining a consistent understanding of the project.
