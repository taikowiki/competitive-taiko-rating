package models

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

type Rating struct {
	TaikoNo string  `json:"taikoNo"`
	Ranking int     `json:"ranking"`
	Rating  float64 `json:"rating"`
	RD      float64 `json:"rd"`
	Vol     float64 `json:"vol"`
}

type SeasonRating struct {
	TaikoNo string  `json:"taikoNo"`
	Season  int     `json:"season"`
	Rating  float64 `json:"rating"`
	Ranking int     `json:"ranking"`
}

type HirobaCompetition struct {
	CompeID string `json:"compeId"`
	Season  int    `json:"season"`
	Session int    `json:"session"`
}

type HirobaCompetitionHistory struct {
	Season  int    `json:"season"`
	Session int    `json:"session"`
	TaikoNo string `json:"taikoNo"`
	Score   int    `json:"score"`
}
