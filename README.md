<h1>EEScheldure</h1>
Telegrammi bot — EEScheldure. Põhifunktsiooniks on kooli tunniplaani saamine veebilehelt tahvel.edu.ee ja selle saatmine kasutajale sobival kujul valitud kuupäevavahemiku kohta. Mugav käskude ja sündmuste süsteem boti realiseerimiseks.
<br /><br />

<h3>Käsud</h3>
<p>/rasp — Koolitundide ajakava saatmine kasutajale mugavas formaadis valitud kuupäevavahemiku jooksul.<br /><em>Sündmused: events/rasp.js</em></p>
<p>/санкции — Kasutaja võimaluse blokeerimine saata mis tahes meediumifaile tema ID alusel.<br /><em>Sündmused: events/blocks.js</em></p>
<p>/chatid — Vestluse ID hankimine ja selle saatmine vestlusesse, kust käsk anti.</p>
<p>/route — Marsruudi planeerimine pildiformaadis, kasutades süsteemi peatus.ee.<br /><em>Sündmused: events/route.js</em></p>

<h3>Lisafunktsioonid</h3>
<p>Logija - Kõigi käskude kasutamise logimine eraldi vestlusesse.</p>

<h3>Põhikäivitusfail</h3>
<p>./index.js</p> 

<h3>Telegrammi boti importimine</h3>
<p>./telegram/TelegramBot.js</p>

<h3>Lisainfo</h3>
Boti töös kasutatakse dotenv’i boti tokeni turvaliseks hoidmiseks.<br />

<h3>Nõuded</h3>
<p>axios dotenv moment node-telegram-bot-api puppeteer</p>

<br />
<em><a target="_blank" href="https://t.me/EEScheldure_bot">EEScheldure</a><br /><a target="_blank" href="https://t.me/botvanjek">Created by Ivan Hramov</a></em>
