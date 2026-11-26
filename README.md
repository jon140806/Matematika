# Učni zvezek ITFR

Prenesi in razširi celoten repozitorij. Za lokalni zagon dvoklikni **Zazeni.py**. Če Windows datoteke Python odpira v urejevalniku, dvoklikni **Zazeni.cmd**. Zaganjalnik potrebuje Python 3 in odpre zvezek v brskalniku. Brez Pythona lahko neposredno odpreš **dist/index.html**.

## Ponovna izdelava po spremembi gradiva

V mapi **gradivo** so vsa predavanja, vaje in stare pole v obliki PDF. Po spremembi vsebine zaženi naslednja ukaza v korenski mapi projekta s Pythonom 3.10 ali novejšim.

```sh
python -m pip install -r requirements.txt
python build.py
```

Za objavo na Netlifyju uporabi mapo **dist**. Za lokalni zagon z Dockerjem uporabi `docker compose up --build -d` in odpri [učni zvezek](http://127.0.0.1:8080/).
