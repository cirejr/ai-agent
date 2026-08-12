# List of Things to-do in core

## Write the validateMime() function, 

takes at least mimeType and new MediaPart.data as params, 
Checks if the mimeType is ok and supported by provider
The above implies that we need a curated list of MIMES supported by each provider, for now only look into OpenRouter and OpenAI for now
return a canonical dataUrl based on mimeType+base64 encoded
Also if data is in bytes, then convert it.

MAXFILESIZE is to be looked into aswell.

## Improve the extractAudioFormat() function

The current flow is good, but way too narrow right not to openRouter, 
also has to decide the return format. 

## And Finally determine what the metadata? is for in opencode's implementation.
