![XSound](./misc/xsound.png)

[![Build Status](https://travis-ci.org/Korilakkuma/XSound.svg?branch=master)](https://travis-ci.org/Korilakkuma/XSound)
[![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT)
[![npm](https://img.shields.io/npm/dt/xsound.svg)](https://www.npmjs.com/package/xsound)
![David](https://img.shields.io/david/Korilakkuma/XSound.svg)
![David Dev](https://img.shields.io/david/dev/Korilakkuma/XSound.svg)
[![jsDelivr](https://data.jsdelivr.com/v1/package/npm/xsound/badge)](https://www.jsdelivr.com/package/npm/xsound)
  
Web Audio API Library for Synthesizer, Effects, Visualization, Recording ... etc
  
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
- Recording (Create WAVE file)
- Session (by WebSocket)
  
XSound don't depend on other libraries or frameworks (For example, jQuery, React).
  
![support-browsers](misc/support-browsers.jpg)
  
## Getting Started

```JavaScript
X('oscillator').setup(true).ready().start(440);
```

## Demo
  
The application that uses XSound is in the following URLs.
  
- [X Sound](https://korilakkuma.github.io/X-Sound/)
- [Music V](https://weblike-curtaincall.ssl-lolipop.jp/portfolio-music-v/)
- [Music Tweet](https://github.com/Korilakkuma/Music-Tweet)
  
Now, I'm creating website for Web Audio API. Please refer to the following site for understanding API Documentation.
  
- [WEB SOUNDER](https://weblike-curtaincall.ssl-lolipop.jp/portfolio-web-sounder/)
  
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

```bash
$ git clone git@github.com:Korilakkuma/XSound.git
$ cd xsound
$ npm install
$ npm run build
$ npm run docker-compose:build
$ npm start
```

## API Documentation
  
- [XSound API Documentation](https://korilakkuma.github.io/xsound-api/)
  
## License
  
Copyright (c) 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018 Tomohiro IKEDA (Korilakkuma)  
Released under the MIT license
  
