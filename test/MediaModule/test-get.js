'use strict';

import MediaModule from '../../src/MediaModule';

describe('MediaModule TEST', () => {
    describe('MediaModule#get', () => {
        const mediaModule = new MediaModule(audiocontext);

        mediaModule.setup({
            'media'     : document.createElement('audio'),
            'formats'   : ['wav', 'ogg', 'mp3'],
            'listeners' : {},
            'autoplay'  : true
        });

        it('should return the instance of `MediaElementAudioSourceNode`', () => {
            expect(mediaModule.get()).toEqual(jasmine.any(MediaElementAudioSourceNode));
        });
    });
});
