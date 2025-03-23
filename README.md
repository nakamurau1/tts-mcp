# tts-mcp

A Model Context Protocol (MCP) server and command-line tool for high-quality text-to-speech generation using the OpenAI TTS API.

## Main Features

- **MCP Server**: Integrate text-to-speech capabilities with Claude Desktop and other MCP-compatible clients
- **Voice Options**: Support for multiple voice characters (alloy, nova, echo, etc.)
- **High-Quality Audio**: Support for various output formats (MP3, WAV, OPUS, AAC)
- **Customizable**: Configure speech speed, voice character, and additional instructions
- **CLI Tool**: Also available as a command-line utility for direct text-to-speech conversion

## Installation

### Method 1: Install from Repository

```bash
# Clone the repository
git clone https://github.com/nakamurau1/tts-mcp.git
cd tts-mcp

# Install dependencies
npm install

# Optional: Install globally
npm install -g .
```

### Method 2: Run Directly with npx (No Installation Required)

```bash
# Start the MCP server directly
npx tts-mcp tts-mcp-server --voice nova --model tts-1-hd

# Use the CLI tool directly
npx tts-mcp -t "Hello, world" -o hello.mp3
```

## MCP Server Usage

The MCP server allows you to integrate text-to-speech functionality with Model Context Protocol (MCP) compatible clients like Claude Desktop.

### Starting the MCP Server

```bash
# Start with default settings
npm run server

# Start with custom settings
npm run server -- --voice nova --model tts-1-hd

# Or directly with API key
node bin/tts-mcp-server.js --voice echo --api-key your-openai-api-key
```

### MCP Server Options

```
Options:
  -V, --version       Display version information
  -m, --model <model> TTS model to use (default: "gpt-4o-mini-tts")
  -v, --voice <voice> Voice character (default: "alloy")
  -f, --format <format> Audio format (default: "mp3")
  --api-key <key>     OpenAI API key (can also be set via environment variable)
  -h, --help          Display help information
```

### Integrating with MCP Clients

The MCP server can be used with Claude Desktop and other MCP-compatible clients. For Claude Desktop integration:

1. Open the Claude Desktop configuration file (typically at `~/Library/Application Support/Claude/claude_desktop_config.json`)
2. Add the following configuration, including your OpenAI API key:

```json
{
  "mcpServers": {
    "tts-mcp": {
      "command": "node",
      "args": ["full/path/to/bin/tts-mcp-server.js", "--voice", "nova", "--api-key", "your-openai-api-key"],
      "env": {
        "OPENAI_API_KEY": "your-openai-api-key"
      }
    }
  }
}
```

Alternatively, you can use npx for easier setup:

```json
{
  "mcpServers": {
    "tts-mcp": {
      "command": "npx",
      "args": ["-p", "tts-mcp", "tts-mcp-server", "--voice", "nova", "--model", "gpt-4o-mini-tts"],
      "env": {
        "OPENAI_API_KEY": "your-openai-api-key"
      }
    }
  }
}
```

You can provide the API key in two ways:

1. **Direct method** (recommended for testing): Include it in the `args` array using the `--api-key` parameter
2. **Environment variable method** (more secure): Set it in the `env` object as shown above

> **Security Note**: Make sure to secure your configuration file when including API keys.

3. Restart Claude Desktop
4. When you ask Claude to "read this text aloud" or similar requests, the text will be converted to speech

### Available MCP Tools

- **text-to-speech**: Tool for converting text to speech and playing it

## CLI Tool Usage

You can also use tts-mcp as a standalone command-line tool:

```bash
# Convert text directly
tts-mcp -t "Hello, world" -o hello.mp3

# Convert from a text file
tts-mcp -f speech.txt -o speech.mp3

# Specify custom voice
tts-mcp -t "Welcome to the future" -o welcome.mp3 -v nova
```

### CLI Tool Options

```
Options:
  -V, --version           Display version information
  -t, --text <text>       Text to convert
  -f, --file <path>       Path to input text file
  -o, --output <path>     Path to output audio file (required)
  -m, --model <n>         Model to use (default: "gpt-4o-mini-tts")
  -v, --voice <n>         Voice character (default: "alloy")
  -s, --speed <number>    Speech speed (0.25-4.0) (default: 1)
  --format <format>       Output format (default: "mp3")
  -i, --instructions <text> Additional instructions for speech generation
  --api-key <key>         OpenAI API key (can also be set via environment variable)
  -h, --help              Display help information
```

## Supported Voices

The following voice characters are supported:
- alloy (default)
- ash
- coral
- echo
- fable
- onyx
- nova
- sage
- shimmer

## Supported Models

- tts-1
- tts-1-hd
- gpt-4o-mini-tts (default)

## Output Formats

The following output formats are supported:
- mp3 (default)
- opus
- aac
- flac
- wav
- pcm

## Environment Variables

You can also configure the tool using system environment variables:

```
OPENAI_API_KEY=your-api-key-here
```

## License

MIT
