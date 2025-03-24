# Project Brief: tts-mcp

## Project Overview
tts-mcp is a comprehensive text-to-speech solution that provides both a command-line interface (CLI) and a Model Context Protocol (MCP) server for high-quality text-to-speech generation using the OpenAI TTS API. It enables seamless integration with Claude Desktop and other MCP-compatible clients, while also functioning as a standalone CLI tool.

## Core Requirements

### Functional Requirements
1. **Command-line Interface**: A versatile CLI tool that transforms text into audio files with customizable parameters.
2. **MCP Server**: A fully-functional MCP server that integrates with Claude Desktop and other MCP clients.
3. **Voice Options**: Support for multiple voice characters (alloy, nova, echo, etc.).
4. **Audio Formats**: Support for various output formats (MP3, WAV, OPUS, AAC, FLAC, PCM).
5. **Customization Options**: Configurable speech speed, voice character, and additional instructions.

### Non-Functional Requirements
1. **Usability**: Simple and intuitive interfaces for both CLI and MCP integration.
2. **Reliability**: Robust error handling and logging for troubleshooting.
3. **Security**: Proper handling of API keys through environment variables or configuration files.
4. **Performance**: Efficient audio generation and playback.

## Project Goals
1. Enhance user experience with Claude and similar AI systems by adding high-quality speech output capabilities.
2. Provide a flexible text-to-speech solution that works both as a standalone tool and as an integrated service.
3. Offer a range of customization options to suit different user preferences and use cases.
4. Enable easy deployment and configuration across different environments.

## Project Scope
### In Scope
- CLI tool for text-to-speech conversion
- MCP server implementation
- Support for all OpenAI voice options and audio formats
- Error handling and logging functionality
- Documentation for installation and usage

### Out of Scope
- Voice training or customization beyond OpenAI's offerings
- Speech recognition or transcription
- Advanced audio editing capabilities
- GUI application (beyond MCP client interfaces)
