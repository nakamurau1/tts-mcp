# Active Context: tts-mcp

## Current Focus
The current focus of the tts-mcp project is on maintaining a stable and reliable text-to-speech solution that works seamlessly both as a standalone CLI tool and as an MCP server integration for Claude Desktop and other MCP-compatible clients.

## Recent Changes
- Implementation of the MCP server functionality for Claude Desktop integration
- Support for the latest OpenAI TTS models, including gpt-4o-mini-tts
- Enhanced error handling and logging for better troubleshooting
- Addition of various audio output formats (MP3, WAV, OPUS, AAC, FLAC, PCM)

## Active Decisions

### API Integration Strategy
- The project uses the official OpenAI Node.js client for API integration
- All voice options provided by OpenAI are supported
- Default voice (alloy) and model (gpt-4o-mini-tts) are configured for optimal quality and performance
- API key is handled via command-line options or environment variables for flexibility

### Performance Optimization
- Temporary files are used for audio playback and then cleaned up
- Error handling includes appropriate cleanup of temporary resources
- Logging is implemented for both troubleshooting and usage tracking

### User Experience
- Both the CLI and MCP server interfaces are designed to be intuitive and easy to use
- Default values are provided for all options to minimize required configuration
- Clear error messages include suggested resolutions

## Next Steps

### Short-term Priorities
1. **Documentation Improvements**: Enhance documentation for better user onboarding
2. **Testing Coverage**: Increase test coverage for core functionality
3. **Error Handling Refinement**: Further improve error messages and recovery mechanisms

### Medium-term Goals
1. **Batch Processing**: Add support for batch processing multiple text files
2. **Streaming Support**: Implement streaming for real-time speech output during generation
3. **Performance Metrics**: Add detailed performance tracking and reporting

### Long-term Vision
1. **Language Support**: Expand support for international languages and accents
2. **Voice Customization**: Investigate options for custom voice tuning
3. **Integration Expansion**: Support additional AI assistant platforms beyond Claude

## Current Challenges
1. **API Limitations**: Working within the constraints of the OpenAI API (rate limits, text length, available voices)
2. **Cross-Platform Compatibility**: Ensuring consistent experience across different operating systems
3. **Audio Playback**: Handling various system configurations for audio playback
4. **Security**: Balancing convenience with security for API key handling

## Integration Considerations
- The MCP server needs to maintain compatibility with MCP protocol updates
- Claude Desktop configuration requires clear documentation for end users
- The CLI tool should maintain backward compatibility for existing scripts and workflows
