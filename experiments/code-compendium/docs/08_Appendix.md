
# Appendix

## Tips for Effective Use

- **Exclude Unnecessary Directories**: Use the --exclude argument to skip directories that don't need to be processed, such as build directories or external dependencies.
- **Default Exclusions**: By default, node_modules, .git, and .env files are excluded to prevent processing large or sensitive directories.
- **Choose Appropriate Extensions**: Ensure that the file extensions you specify include all the code and documentation files you wish to process.
- **Set a Reasonable Word Limit**: Adjust the --word-limit according to your needs. A smaller limit results in more files but smaller sizes, which can be beneficial for AI models.
- **Organize Input Directory**: Having a well-organized input directory can help in producing more coherent aggregated content.

## Troubleshooting

- **No Output Generated**: Ensure that the input directory contains files with the specified extensions and that excluded directories are not interfering.
- **Unexpected Errors**: Check that all dependencies are installed correctly and that you have the necessary permissions to read from the input directory and write to the output directory.
- **Including Excluded Directories**: If you need to include a directory that's excluded by default (e.g., node_modules), you can override the default exclusions using the --exclude argument.

## Contribution Guidelines

We welcome contributions to improve Code Compendium. Please follow these guidelines:

- **Fork the Repository**: Create a personal fork of the repository on GitHub.
- **Create a Branch**: Make a new branch for your feature or bug fix.
- **Submit a Pull Request**: Provide a clear description of your changes and submit a pull request for review.

## License

Code Compendium is released under the [MIT License](/LICENSE).

---

**Note**: This documentation is designed for printing and can be included in your MkDocs project or any other documentation tool. Copy and paste the content into your Markdown files as needed.
