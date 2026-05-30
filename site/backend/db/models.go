package db

type Session struct {
	ID        int    `json:"id"`
	Season    int    `json:"season"`
	Session   int    `json:"session"`
	SongNo1   string `json:"songNo1"`
	SongNo2   string `json:"songNo2"`
	SongNo3   string `json:"songNo3"`
	Diff1     string `json:"diff1"`
	Diff2     string `json:"diff2"`
	Diff3     string `json:"diff3"`
	StartDate string `json:"startDate"`
	EndDate   string `json:"endDate"`
	CheckDate string `json:"checkDate"`
}

type HirobaCompetition struct {
	CompeID string `json:"compeId"`
	Season  int    `json:"season"`
	Session int    `json:"session"`
}

type Season struct {
	Season    int    `json:"season"`
	StartDate string `json:"startDate"`
	EndDate   string `json:"endDate"`
}

type Rating struct {
	TaikoNo string  `json:"taikoNo"`
	Rating  float64 `json:"rating"`
	Ranking int     `json:"ranking"`
	RD      float64 `json:"RD"`
	Vol     float64 `json:"Vol"`
}

type SeasonRating struct {
	TaikoNo string  `json:"taikoNo"`
	Rating  float64 `json:"rating"`
	Ranking int     `json:"ranking"`
	Season  int     `json:"season"`
}

type CompeHistory struct {
	Season  int    `json:"season"`
	Session int    `json:"session"`
	TaikoNo string `json:"taikoNo"`
	Score   int    `json:"score"`
}
