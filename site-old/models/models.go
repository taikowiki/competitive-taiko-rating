package models

type Competition struct {
	ID        int       `json:"id" db:"id"`
	Season    int       `json:"season" db:"season"`
	Session   int       `json:"session" db:"session"`
	SongNo1   string    `json:"songNo1" db:"songNo1"`
	SongNo2   string    `json:"songNo2" db:"songNo2"`
	SongNo3   string    `json:"songNo3" db:"songNo3"`
	Diff1     string    `json:"diff1" db:"diff1"`
	Diff2     string    `json:"diff2" db:"diff2"`
	Diff3     string    `json:"diff3" db:"diff3"`
	StartDate string    `json:"startDate" db:"startDate"`
	EndDate   string    `json:"endDate" db:"endDate"`
	CheckDate string    `json:"checkDate" db:"checkDate"`
}

type Season struct {
	Season    int    `json:"season" db:"season"`
	StartDate string `json:"startDate" db:"startDate"`
	EndDate   string `json:"endDate" db:"endDate"`
}

type Rating struct {
	TaikoNo string  `json:"taikoNo" db:"taikoNo"`
	Ranking int     `json:"ranking" db:"ranking"`
	Rating  float64 `json:"rating" db:"rating"`
	RD      float64 `json:"RD" db:"RD"`
	Vol     float64 `json:"Vol" db:"Vol"`
}

type SeasonRating struct {
	TaikoNo string  `json:"taikoNo" db:"taikoNo"`
	Season  int     `json:"season" db:"season"`
	Rating  float64 `json:"rating" db:"rating"`
	Ranking int     `json:"ranking" db:"ranking"`
}

type HirobaCompetition struct {
	CompeID string `json:"compeId" db:"compeId"`
	Season  int    `json:"season" db:"season"`
	Session int    `json:"session" db:"session"`
}

type HirobaCompetitionHistory struct {
	Season  int    `json:"season" db:"season"`
	Session int    `json:"session" db:"session"`
	TaikoNo string `json:"taikoNo" db:"taikoNo"`
	Score   int    `json:"score" db:"score"`
}
