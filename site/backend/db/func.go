package db

import (
	"database/sql"
)

func (db *DB) GetCurrentSession() (*Competition, error) {
	row := db.QueryRow("SELECT id, season, session, songNo1, songNo2, songNo3, diff1, diff2, diff3, startDate, endDate, checkDate FROM `competition` ORDER BY `id` DESC LIMIT 1")
	var c Competition
	err := row.Scan(&c.ID, &c.Season, &c.Session, &c.SongNo1, &c.SongNo2, &c.SongNo3, &c.Diff1, &c.Diff2, &c.Diff3, &c.StartDate, &c.EndDate, &c.CheckDate)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	return &c, nil
}

func (db *DB) GetHirobaCompetitions(season, session int) ([]string, error) {
	query := "SELECT compeId FROM hiroba_competition WHERE season = ? AND session = ?"
	rows, err := db.Query(query, season, session)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var ids []string
	for rows.Next() {
		var id string
		if err := rows.Scan(&id); err != nil {
			continue
		}
		ids = append(ids, id)
	}
	return ids, nil
}

func (db *DB) GetLatestHirobaCompetitions() ([]string, error) {
	var season, session int
	err := db.QueryRow("SELECT season, session FROM hiroba_competition ORDER BY season DESC, session DESC LIMIT 1").Scan(&season, &session)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}

	return db.GetHirobaCompetitions(season, session)
}

func (db *DB) GetCurrentHirobaCompeIds() ([]string, error) {
	comp, err := db.GetCurrentSession()
	if err != nil {
		return nil, err
	}
	if comp == nil {
		return nil, nil
	}

	ids, err := db.GetHirobaCompetitions(comp.Season, comp.Session)
	if err != nil {
		return nil, err
	}

	if len(ids) == 0 {
		return db.GetLatestHirobaCompetitions()
	}

	return ids, nil
}

