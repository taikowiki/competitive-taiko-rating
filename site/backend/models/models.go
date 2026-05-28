package models

type Competition struct {
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
