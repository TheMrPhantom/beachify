FROM python:3-bullseye

WORKDIR /usr/src/app

RUN apt update
RUN apt -y install texlive texlive-luatex texlive-lang-german texlive-latex-extra pandoc
RUN mkdir -p ~/.local/share/fonts
COPY Latex/Exo-Regular.ttf ./
RUN cp ./Exo-Regular.ttf ~/.local/share/fonts/

COPY requirements.txt ./
RUN fc-cache -f -v

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD [ "python", "-u", "./main.py" ]