# Toxicity Free Chatroom

NLP powered anti toxicity chatroom that automatically detects and de-toxifies messages containing profanities and other offensive content,
the classification is performed using a fine-tuned BERT model and detoxification is carried out by a fine-tuned BART model,
both models use the <a href='https://aclanthology.org/2022.acl-long.469/'>paradetox dataset</a> but in different structural formats.

Inspiration taken from [afieif/SafeChat](https://github.com/afieif/SafeChat)
