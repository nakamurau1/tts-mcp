# Technical Context: tts-mcp

## Technology Stack

### Core Technologies
- **TypeScript**: Primary programming language
- **Node.js**: Runtime environment
- **OpenAI API**: Text-to-speech generation service
- **Model Context Protocol (MCP)**: Protocol for AI tool integration

### Dependencies
| Dependency | Purpose | Version |
|------------|---------|---------|
| openai | OpenAI API client | Latest |
| @modelcontextprotocol/sdk | MCP server implementation | Latest |
| play-sound | Audio playback | Latest |
| commander | CLI argument parsing | Latest |
| zod | Runtime type validation | Latest |

### Development Dependencies
- **TypeScript**: Static typing and transpilation
- **Jest**: Testing framework
- **ESLint**: Code quality and style enforcement

## Development Environment

### Prerequisites
- Node.js (v16 or later)
- npm or yarn package manager
- OpenAI API key with TTS access

### Development Setup
1. Clone the repository
2. Install dependencies with `npm install`
3. Set up environment variables (OPENAI_API_KEY)
4. Run in development mode or build for production

### Environment Variables
- `OPENAI_API_KEY`: Required for accessing OpenAI's API services

## Build and Deployment

### Build Process
1. TypeScript compilation via `tsc`
2. Permissions setting for executable files
3. Package preparation for distribution

### Installation Methods
1. **Local Installation**:
   ```bash
   npm install -g /path/to/tts-mcp
   ```

2. **Direct Repository Installation**:
   ```bash
   npm install -g github:nakamurau1/tts-mcp
   ```

3. **Run without Installation** (via npx):
   ```bash
   npx tts-mcp ...
   ```

## Integration Points

### OpenAI API Integration
- Uses the official OpenAI Node.js client
- Interfaces with the audio.speech.create endpoint
- Supports all available voice models and formats
- Handles API authentication via key

### MCP Integration
- Implements MCP server specification
- Communicates via stdio transport
- Registers text-to-speech as a tool
- Compatible with Claude Desktop and other MCP clients

## Technical Constraints

### API Limitations
- Dependent on OpenAI API availability and rate limits
- Maximum text length constraints from OpenAI API
- Voice character options limited to OpenAI's offerings

### Performance Considerations
- TTS conversion time depends on text length and OpenAI API response time
- Temporary file storage needed for audio playback
- Memory usage scales with audio file size

### Security Considerations
- API key handling requires secure storage
- Temporary files contain potentially sensitive information
- Configuration files may contain API keys

## File Structure
```
tts-mcp/
├── bin/                # Executable entry points
│   ├── tts-mcp.js      # CLI tool entry
│   ├── tts-mcp.ts      # CLI source
│   ├── tts-mcp-server.js  # MCP server entry
│   └── tts-mcp-server.ts  # MCP server source
├── src/                # Source code
│   ├── api.ts          # OpenAI API integration
│   ├── constants.ts    # Shared constants
│   ├── index.ts        # Core application logic
│   ├── mcp-server.ts   # MCP server implementation
│   ├── types.ts        # Type definitions
│   └── utils.ts        # Utility functions
├── test/               # Test files
│   ├── api.test.ts     # API tests
│   ├── integration.test.ts # Integration tests
│   ├── mcp-server.test.ts  # MCP server tests
│   └── utils.test.ts   # Utility function tests
├── .env.example        # Example environment variables
├── package.json        # Project dependencies and scripts
└── tsconfig.json       # TypeScript configuration
```

## Testing Strategy
- **Unit Tests**: For individual components (api.ts, utils.ts)
- **Integration Tests**: For end-to-end functionality
- **MCP Protocol Tests**: Verify MCP server compliance

## Supported Platforms
- macOS
- Linux
- Windows (with potential path handling differences)
