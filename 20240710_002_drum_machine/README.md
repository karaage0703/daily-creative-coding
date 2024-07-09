# 20240710_002_drum_machine

Claude 3.5 Sonnet Prompt

```
X TOUCH MiniをMIDIデバイスの入力にした
8列4行のドラムマシンシーケンサを作ってください

以下がX TOUCH MINIのボタンの情報です。
ドラムに対応させてください。

1番上の左はじのボタンを押したときのMIDI Message 154 8 127
1番上の右はじのボタンを押したときのMIDI Message 154 15 127

2番目の左はじのボタンを押したときのMIDI Message 154 16 127
2番目の右はじのボタンを押したときのMIDI Message 154 23 127

3番目の左はじのボタンを押したときの MIDI Message 154 32 127
3番目の右はじのボタンを押したときの MIDI Message 154 39 127

4番目の左はじのボタンを押したときのMIDI Message 154 40 127
4番目の右はじのボタンを押したときのMIDI Message 154 47 127

音色はノブの動きで変えてください。xはノブの値でデフォルトが64で最小が0、最大が128です

1番目の左はじのノブのMIDI Message 186 1 x
1番目の右はじのノブのMIDI Message 186 8 x
2番目の左はじのノブのMIDI Message 186 11 x
2番目の右はじのノブのMIDI Message 186 18 x
```

# References
