# Active Context: tts-mcp

## Current Focus
The current focus of the tts-mcp project is on maintaining a stable and reliable text-to-speech solution that works seamlessly both as a standalone CLI tool and as an MCP server integration for Claude Desktop and other MCP-compatible clients. Additionally, improving test coverage and integration testing is a priority to ensure robust functionality.

## Recent Changes
- **Added descriptions to text-to-speech MCP tool and its parameters for better user experience**
- **Enhanced MCP client tests to verify descriptions are properly transmitted**
- Implementation of the MCP server functionality for Claude Desktop integration
- Support for the latest OpenAI TTS models, including gpt-4o-mini-tts
- Enhanced error handling and logging for better troubleshooting
- Addition of various audio output formats (MP3, WAV, OPUS, AAC, FLAC, PCM)
- **Added integration tests for MCP server and client-server interactions**
- **Updated test environment to better handle async operations**
- **Created test helpers for MCP server testing**

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
- **MCP tools include descriptive information for improved usability in Claude Desktop**
- **Tool parameters have detailed descriptions to guide users on proper usage**

### Testing Strategy
- **Unit tests for core components and utilities**
- **Integration tests for CLI functionality and MCP server operations**
- **Environment variable-based control for running integration tests (`INTEGRATION_TEST=true`)**
- **Graceful handling of API errors in test scenarios**
- **Helper functions to standardize test setup and teardown**

## Next Steps

### Short-term Priorities
1. **Testing Coverage**: Continue to enhance integration tests and address test stability issues
2. **Documentation Improvements**: Enhance documentation for better user onboarding
3. **Error Handling Refinement**: Further improve error messages and recovery mechanisms
4. **CI/CD Integration**: Set up automated testing in CI/CD pipeline

### Medium-term Goals
1. **Batch Processing**: Add support for batch processing multiple text files
2. **Streaming Support**: Implement streaming for real-time speech output during generation
3. **Performance Metrics**: Add detailed performance tracking and reporting

### Long-term Vision
1. **Language Support**: Expand support for international languages and accents
2. **Voice Customization**: Investigate options for custom voice tuning
3. **Integration Expansion**: Support additional AI assistant platforms beyond Claude

## Current Challenges
1. **Testing Environment**: Ensuring reliable and stable integration tests across different environments
2. **API Limitations**: Working within the constraints of the OpenAI API (rate limits, text length, available voices)
3. **Cross-Platform Compatibility**: Ensuring consistent experience across different operating systems
4. **Audio Playback**: Handling various system configurations for audio playback
5. **Security**: Balancing convenience with security for API key handling

## Integration Considerations
- The MCP server needs to maintain compatibility with MCP protocol updates
- Claude Desktop configuration requires clear documentation for end users
- The CLI tool should maintain backward compatibility for existing scripts and workflows
- Integration tests need to handle real-world API interactions gracefully
