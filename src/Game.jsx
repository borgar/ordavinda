import React from 'react';
import { Tile } from './Tile.jsx';
import Icon from './Icon.jsx';
import { Score } from './Score.jsx';
import { Timer } from './Timer.jsx';
import { CLEAR_BONUS, GAME_FAILED, GAME_ONGOING, GAME_PENDING, GAME_SOLVED, LEVEL_TIME, SCORES } from './constants.js';
import { shuffle } from './utils/shuffle.js';
import { WordList } from './WordList.jsx';
import { KeyHandler } from './KeyHandler.jsx';
import { Button } from './Button.jsx';
import { levelHistory } from './utils/levelHistory.js';
import { levels } from './utils/levels.js';
import { Clock } from './utils/Clock.js';
import { animateWithClass } from './utils/animateWithClass.js';
import { Toaster } from './Toaster.jsx';
import { loadSound, playSound } from './utils/audio.js';
import { sizeThenAlphabetical } from './utils/sizeThenAlphabetical.js';
import css from './Game.css';

/**
 * @typedef LevelData
 * @prop {string} key
 * @prop {string[]} words
 */

const TIME = LEVEL_TIME;

loadSound('fail', 'bonk.mp3');
loadSound('match', 'fingerplop.mp3');
loadSound('passed', 'bell_tree.mp3');
loadSound('tick', 'clock.mp3', 0.8);
loadSound('gameover', 'chime.mp3');

export class Game extends React.PureComponent {
  constructor (props) {
    super(props);
    this.state = {
      levelsList: [],
      level: null,
      letters: [],
      word: [],
      found: [],
      solved: false,
      lastGuess: null,
      clock: new Clock(),
      score: 0,
      state: GAME_PENDING,
    };
    this.state.clock.on('tick', this.onTick);
  }

  componentDidMount () {
    this.startRun();
  }

  startRun = () => {
    this.setState({
      score: 0,
      state: GAME_PENDING,
    }, () => {
      this.playNextLevel();
    });
  };

  playNextLevel = () => {
    // pick next level to play
    let next = -1;
    while (next < 0) {
      next = Math.trunc(Math.random() * levels.length);
      if (levelHistory.has(levels[next].key)) {
        next = -1;
      }
    };
    /** @type {LevelData} */
    const level = levels[next];
    level.words.sort(sizeThenAlphabetical);
    levelHistory.add(level.key);
    const letters = level.key.split('').map((d, i) => ({
      char: d.toUpperCase(),
      id: `${d}_${i}`,
      active: false,
      place: 0,
      rot: (Math.random() * 4) - 4
    }));
    shuffle([1, 2, 3, 4, 5, 6]).forEach((place, i) => {
      letters[i].place = place;
    });
    this.state.clock.stop();
    this.setState({
      level,
      letters: letters,
      word: [],
      found: [],
      solved: false,
      lastGuess: null,
      state: GAME_ONGOING,
    }, () => {
      this.state.clock.start();
    });
  };

  onAddLetter = letter => {
    if (!letter) { return; }
    letter.active = true;
    this.setState({
      word: [ ...this.state.word, letter ],
      letters: [ ...this.state.letters ],
    });
  };

  onRemoveLetter = letter => {
    if (!letter) { return; }
    letter.active = false;
    this.setState({
      word: this.state.word.filter(d => d !== letter),
      letters: [ ...this.state.letters ],
    });
  };

  onClearWord = () => {
    const { level, found, letters } = this.state;
    const wordsLeft = level.words.length - found.length;
    this.setState({
      word: [],
      letters: letters.map(d => (d.active = false, d)),
    }, wordsLeft === 0 ? this.onLevelOver : undefined);
  };

  onRecallWord = () => {
    if (!this.state.lastGuess) { return; }
    const word = this.state.lastGuess.map(d => {
      const letter = this.state.letters.find(l => l.id === d);
      letter.active = true;
      return letter;
    });
    this.setState({
      word: word,
      letters: [ ...this.state.letters ],
    });
  };

  onShuffle = () => {
    const { letters } = this.state;
    shuffle([1, 2, 3, 4, 5, 6]).forEach((place, i) => {
      letters[i].place = place;
    });
    this.setState({ letters: [ ...letters ] }, () => {
      /** @type {HTMLButtonElement[]} */
      ([ ...document.querySelectorAll('#letters .letter') ])
        .forEach((elm, i) => {
          const b = Math.floor((Math.random() * 80) - 40);
          elm.style.setProperty("--bounce", b+"px");
          animateWithClass(elm, 'move', i * 20);
        });
    });
  };

  onSubmitWord = () => {
    // is word available
    let guess = this.state.word
      .map(d => d.char)
      .join('')
      .toLowerCase();
    if (this.state.found.includes(guess)) {
      // already found
      this.toaster.toast('Orðið er í notkun!', 1.2);
      animateWithClass(document.getElementById('input'), 'guess_fail');
      this.onClearWord();
    }
    else if (this.state.level.words.includes(guess)) {
      // found one!
      animateWithClass(document.getElementById('input'), 'guess_okay');
      if (guess.length === 6 && !this.state.solved) {
        // play audio: pass
        this.toaster.toast('Opið á næsta borð...', 2);
        playSound('passed');
      }
      else {
        playSound('match');
      }
      console.log('score', [ this.state.score, SCORES[guess.length] ]);
      this.setState({
        score: this.state.score + SCORES[guess.length],
        found: [ ...this.state.found, guess ],
        lastGuess: this.state.word.map(d => d.id),
        solved: this.state.solved || guess.length === 6,
      }, this.onClearWord);
    }
    else {
      this.toaster.toast('Orðið er ekki samþykkt!', 1.2);
      animateWithClass(document.getElementById('input'), 'guess_fail');
      this.setState({
        lastGuess: this.state.word.map(d => d.id),
      }, this.onClearWord);
    }
  };

  onKeyPress = e => {
    if (e.key === 'enter') {
      if (this.state.word.length > 0) {
        this.onSubmitWord();
      }
      else {
        this.onRecallWord();
      }
    }
    else if (e.key === 'backspace') {
      const last = this.state.word.at(-1);
      this.onRemoveLetter(last);
    }
    else if (e.key === 'escape') {
      this.onClearWord();
    }
    else if (e.key === ' ') {
      this.onShuffle();
    }
    else {
      // key is an available letter?
      const key = e.key.toUpperCase();
      const pressed = this.state.letters
        .find(d => d.char === key && !d.active);
      if (pressed) {
        this.onAddLetter(pressed);
      }
    }
  };

  onLevelOver () {
    this.state.clock.stop();
    if (this.state.solved) {
      // playSound('tada');
      let state = { state: GAME_SOLVED };
      if (this.state.found.length === this.state.level.words.length) {
        state.score = this.state.score + CLEAR_BONUS;
      }
      this.setState(state);
    }
    else {
      playSound('gameover');
      this.setState({ state: GAME_FAILED });
    }
  }

  onTick = s => {
    const remain = Math.max(0, TIME - s);
    if (remain === 0) {
      this.onLevelOver();
    }
    else if (remain < 11) {
      playSound('tick');
    }
  };

  render () {
    const { level, found, word, letters, state } = this.state;
    return (
      <>
        <div className="stats">
          <Score
            score={this.state.score}
            />
          <Timer
            clock={this.state.clock}
            duration={TIME}
            />
        </div>

        <div id="board">
          {!!level && (
            <WordList
              words={level.words}
              found={found}
              expose={state === GAME_FAILED || state === GAME_SOLVED}
              />
          )}
        </div>

        {state === GAME_FAILED && (
          <div className='gameover'>
            <h4>Leik lokið!</h4>
            <Button onClick={this.props.onExit}>
              Um leikinn
            </Button> {} {'\u00A0'} {}
            <Button onClick={this.startRun}>
              Spila aftur
            </Button>
          </div>
        )}
        {state === GAME_SOLVED && (
          <div className='gamesolved'>
            <h4>Borð sigrað!</h4>
            <Button onClick={this.playNextLevel}>
              Spila næsta...
            </Button>
          </div>
        )}
        {state === GAME_ONGOING && (
          <>
            <div id="input" className='input'>
              {word.map(d => (
                <span
                  key={d.id}
                  className='char'
                  onClick={e => this.onRemoveLetter(d)}
                  >
                  {d.char}
                </span>
              ))}
              <span className='spacer' />
              {!!word.length && (
                <button
                  id="word_clear"
                  onClick={this.onClearWord}
                  >
                  <Icon name="clear" />
                </button>
              )}
            </div>

            <div id="rack">
              <Button
                className="tileButton"
                onClick={this.onShuffle}
                >
                <Icon name="swap_horiz" />
              </Button>

              <div id="letters">
                {letters.map(d => (
                  <Tile
                    key={d.id}
                    data={d}
                    onClick={this.onAddLetter}
                    />
                ))}
              </div>

              {word.length > 0 && (
                <Button
                  className="tileButton"
                  onClick={this.onSubmitWord}
                  >
                  <Icon name="check" />
                </Button>
              )}
              {word.length < 1 && (
                <Button
                  className="tileButton"
                  onClick={this.onRecallWord}
                  disabled={!this.state.lastGuess}
                  >
                  <Icon name={this.state.lastGuess ? "north" : "check"} />
                </Button>
              )}
            </div>
          </>
        )}

        <Toaster ref={elm => (this.toaster = elm)} />
        <KeyHandler onKey={this.onKeyPress} />
      </>
    );
  }
}
