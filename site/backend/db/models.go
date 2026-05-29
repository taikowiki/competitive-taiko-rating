package db

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

type HirobaCompetition struct {
	CompeID string `json:"compeId"`
	Season  int    `json:"season"`
	Session int    `json:"session"`
}
