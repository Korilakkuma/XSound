<h1 style="font-famlily: 'Lucida Grande', 'Calibri', Helvetica, Arial, sans-serif; font-size: 144px; font-weight: normal; color: #c000c0; text-shadow: -1px -1px 1px #000;">XSound</h1>

[![Node.js CI](https://github.com/Korilakkuma/XSound/workflows/Node.js%20CI/badge.svg)](https://github.com/Korilakkuma/XSound/actions?query=workflow%3A%22Node.js+CI%22)
![node-current](https://img.shields.io/node/v/xsound?color=brightgreen)
[![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT)
[![npm](https://img.shields.io/npm/dt/xsound.svg)](https://www.npmjs.com/package/xsound)
![David Dev](https://img.shields.io/david/dev/Korilakkuma/XSound.svg)
[![jsDelivr](https://data.jsdelivr.com/v1/package/npm/xsound/badge)](https://www.jsdelivr.com/package/npm/xsound)
  
Web Audio API Library for Synthesizer, Effects, Visualization, Multi-Track Recording, Audio Streaming, Visual Audio Sprite ... etc
  
## Overview
  
XSound is Multifunctional Library for Web Audio API.  
In concrete, XSound may be useful to implement the following features.
  
- Create Sound
- Play the One-Shot Audio
- Play the Audio
- Play the Media
- Streaming (by WebRTC)
- MIDI (by Web MIDI API)
- MML (Music Macro Language)
- Effectors (Compressor / Wah / Equalizer / Tremolo / Phaser / Chorus / Delay / Reverb ... etc)
- Visualization (Overview in Time Domain / Time Domain / Spectrum)
- Multi-Track Recording (Create WAVE file)
- Session (by WebSocket)
- Audio Streaming
- Visual Audio Sprite
  
XSound don't depend on other libraries or frameworks (For example, jQuery, React).
  
## Supported Browsers
  
<img src="./misc/supported-browsers.png" alt="Supported Browsers" style="max-width: 100%;" />
  
## Getting Started

In the case of using as **full stack** (For example, use oscillator) ...

```JavaScript
X('oscillator').setup(true).ready().start(440);
```

or, in the case of using as **module base** (For example, use chorus effector) ...

```JavaScript
// The instance of `AudioContext`
const context = X.get();

// Create the instance of `Chorus` that is defined by XSound
// (The 2nd argument is buffer size for `ScriptProcessorNode`)
const chorus = new X.Chorus(context, 0);

const oscillator = context.createOscillator();

// The instance that is defined by XSound has connectors for input and output
oscillator.connect(chorus.INPUT);
chorus.OUTPUT.connect(context.destination);

// Set parameters for chorus
chorus.param({
  time : 0.025,
  depth: 0.5,
  rate : 2.5,
  mix  : 0.5
})

// Activate
chorus.state(true);

oscillator.start(0);
```

XSound enable to using the following classes (Refer to [API Documentation](https://xsound.dev) for details).

```TypeScript
type BufferSize = 0 | 256 | 512 | 1024 | 2048 | 4096 | 8192 | 16384;

// Effectors
X.Autopanner(context: AudioContext, size: BufferSize);
X.Chorus(context: AudioContext, size: BufferSize);
X.Compressor(context: AudioContext, size: BufferSize);
X.Delay(context: AudioContext, size: BufferSize);
X.Distortion(context: AudioContext, size: BufferSize);
X.Equalizer(context: AudioContext, size: BufferSize);
X.Filter(context: AudioContext, size: BufferSize);
X.Flanger(context: AudioContext, size: BufferSize);
X.Listener(context: AudioContext, size: BufferSize);
X.Panner(context: AudioContext, size: BufferSize);
X.Phaser(context: AudioContext, size: BufferSize);
X.PitchShifter(context: AudioContext, size: BufferSize);
X.Reverb(context: AudioContext, size: BufferSize);
X.Ringmodulator(context: AudioContext, size: BufferSize);
X.Stereo(context: AudioContext, size, size: BufferSize);
X.Tremolo(context: AudioContext, size: BufferSize);
X.Wah(context: AudioContext, size: BufferSize);

X.Analyser(context: AudioContext);

X.Recorder(context: AudioContext, size: BufferSize, numberOfInputs: number, numberOfOutputs: number);

X.Session(context: AudioContext, size: BufferSize, numberOfInputs: number, numberOfOutputs, analyser: X.Analyser);
```

## Demo
  
The application that uses XSound is in the following URLs.
  
- [XSound.app](https://xsound.app)
- [x-piano](https://korilakkuma.github.io/x-piano/)
- [Music V](https://weblike-curtaincall.ssl-lolipop.jp/portfolio-music-v/)
- [Music Tweet](https://github.com/Korilakkuma/Music-Tweet)
- [Chrome EQUALIZER](https://github.com/Korilakkuma/Chrome-EQUALIZER)
  
Now, I'm creating website for Web Audio API. Please refer to the following site for understanding API Documentation.
  
- [WEB SOUNDER](https://weblike-curtaincall.ssl-lolipop.jp/portfolio-web-sounder/)
  
## Playground

You can view overview on [YouTube](https://www.youtube.com/watch?v=zqdmoB8VICY).

[![Playground](./misc/playground.gif)](https://xsound.jp/playground)

## Installation

```bash
$ npm install --save xsound
```

## Usage

In the case of using CDN,

```HTML
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/xsound@latest/build/xsound.min.js"></script>
```

In the case of using ESModules for SSR ... etc,

```JavaScript
import { XSound, X } from 'xsound';
```

## Setup

### Use Webpack Dev Server

```bash
$ git clone git@github.com:Korilakkuma/XSound.git
$ cd XSound
$ npm install
$ npm run dev
$ open http://localhost:8080/playground/
```

### Use Docker

```bash
$ git clone git@github.com:Korilakkuma/XSound.git
$ cd XSound
$ npm install
$ npm run watch
$ docker-compose up -d --build
$ open http://localhost:8080/playground/
```

## API Documentation
  
- [XSound API Documentation](https://xsound.dev)
  
## Pickups
  
- [9 libraries to kickstart your Web Audio stuff - DEV Community](https://dev.to/areknawo/9-libraries-to-kickstart-your-web-audio-stuff-460p)
  - <blockquote>XSound is a batteries-included library for everything audio. From basic management and loading through streaming, effects, ending with visualizations and recording, this libraries provides almost everything! It also has nice, semi-chainable API with solid documentation.</blockquote>
- [20 Useful Web Audio Javascript Libraries – Bashooka](https://bashooka.com/coding/web-audio-javascript-libraries/)
- [Extending X3D Realism with Audio Graphs, Acoustic  Properties and 3D Spatial Sound](https://dl.acm.org/doi/10.1145/3424616.3424709)
  
## License
  
Released under the [MIT](https://github.com/Korilakkuma/XSound/blob/master/LICENSE) license
  
