package server

type Song struct {
	SongNo string `json:"songNo"`
	Title  string `json:"title"`
	Level  int    `json:"level"`
	Diff   string `json:"diff"`
}

type Session struct {
	Season  int    `json:"season"`
	Session int    `json:"session"`
	Songs   []Song `json:"songs"`
	Start   string `json:"start"`
	End     string `json:"end"`
}
