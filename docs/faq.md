# FAQ

- I'm getting the following error: `EntityMetadataNotFound: No metadata for "XXX" was found.`. What should I do?

Check that you registered all your entities in the `InitDB` hook of the `AppModule` class.
