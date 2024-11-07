import React from 'react';
import { Button } from './Button.jsx';
import css from './AttractMode.css';

export function AttractMode ({ onPlay }) {
  return (
    <div className="attract">
      <div className="scrollwrapper">

        <h3>Leikreglur</h3>

        <p>Markmið leiksins er að reyna að mynda sem flest orð úr 6 stöfum áður en tíminn rennur út.</p>

        <p>Til þess að komast í næsta borð, og fá að halda áfram að safna stigum, verður 
           þú að finna 6 stafa orð áður en tíminn rennur út.</p>

        <p>Hægt er að stjórna leiknum með bæði mús/snertiskjá og lyklaborði. 
           Lyklaborðvirknin, fyrir utan stafina sjálfa, er eftirfarandi:</p>
    
        <table>
          <tbody>
            <tr>
              <th><code>&lt;enter&gt;</code></th>
              <td>Velur orð þegar það er til staðar, 
                en endurkallar síðasta orð ef engin stafur er valinn.</td>
            </tr>
            <tr>
              <th><code>&lt;esc&gt;</code></th>
              <td>Færir alla stafi aftur í bakka.</td>
            </tr>
            <tr>
              <th><code>&lt;space&gt;</code></th>
              <td>Vinda / endurraða stöfum í bakka.</td>
            </tr>
         </tbody>
        </table>

        <p className='center'>
          <Button
            className="large"
            onClick={onPlay}
            >
            Spila Orðavindu
          </Button>
        </p>

        <hr />

        <p className='about'>
          Orðavinda er upprunalega gerð sem innlegg í samkeppninni "<a href="https://vefsafn.is/is/20190118152842/http://www.ordid.is/forsida/" target='_blank'>Þú átt orðið</a>".
          Höfundur er <a href="http://borgar.net" target='_blank'>borgar.net</a>.
          Leikurinn styðst við orðasafn <a href="http://bin.arnastofnun.is/">BÍN</a>.
        </p>

      </div>
    </div>
  );
}
