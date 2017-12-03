VERSION = $(shell jq -r .version manifest.json)

archive:
	git archive --format=zip master > HideFixedElements-$(VERSION).zip
