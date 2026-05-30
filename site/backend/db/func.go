package db

import (
	"database/sql"
	"slices"
)

func (db *DB) GetCurrentSession() (*Session, error) {
	row := db.QueryRow("SELECT id, season, session, songNo1, songNo2, songNo3, diff1, diff2, diff3, startDate, endDate, checkDate FROM `competition` ORDER BY `id` DESC LIMIT 1")
	var c Session
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

func (db *DB) GetSeasons() ([]Season, error) {
	rows, err := db.Query("SELECT * FROM `season` ORDER BY `season` DESC")
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	seasons := []Season{}
	for rows.Next() {
		var season Season
		if err := rows.Scan(&season.Season, &season.StartDate, &season.EndDate); err != nil {
			continue
		}
		seasons = append(seasons, season)
	}
	return seasons, nil
}

func (db *DB) GetCurrentRatings() ([]Rating, error) {
	rows, err := db.Query("SELECT * FROM `rating` ORDER BY `ranking` ASC")
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	ratings := []Rating{}
	for rows.Next() {
		var rating Rating
		if err := rows.Scan(
			&rating.TaikoNo,
			&rating.Rating,
			&rating.Ranking,
			&rating.RD,
			&rating.Vol,
		); err != nil {
			continue
		}
		ratings = append(ratings, rating)
	}
	return ratings, nil
}

func (db *DB) GetSeasonRatings(season int) ([]SeasonRating, error) {
	rows, err := db.Query("SELECT * FROM `season_rating` WHERE `season` = ? ORDER BY `ranking` ASC", season)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	ratings := []SeasonRating{}
	for rows.Next() {
		var rating SeasonRating
		if err := rows.Scan(
			&rating.TaikoNo,
			&rating.Rating,
			&rating.Ranking,
			&rating.Season,
		); err != nil {
			continue
		}
		ratings = append(ratings, rating)
	}
	return ratings, nil
}

func (db *DB) GetSessionsBySeason(season int) ([]Session, error) {
	rows, err := db.Query("SELECT * FROM `competition` WHERE `season` = ? ORDER BY `session` DESC", season)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}

	sessions := []Session{}
	for rows.Next() {
		var session Session
		if err := rows.Scan(&session.ID, &session.Season, &session.Session, &session.SongNo1, &session.SongNo2, &session.SongNo3, &session.Diff1, &session.Diff2, &session.Diff3, &session.StartDate, &session.EndDate, &session.CheckDate); err != nil {
			continue
		}
		sessions = append(sessions, session)
	}
	return sessions, nil
}

func (db *DB) GetCompeHistories(season int, session int) ([]CompeHistory, error) {
	rows, err := db.Query("SELECT * FROM `hiroba_competition_history` WHERE `season` = ? AND `session` = ? ORDER BY `score` DESC", season, session)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}

	histories := []CompeHistory{}
	for rows.Next() {
		var history CompeHistory
		if err := rows.Scan(
			&history.Season,
			&history.Session,
			&history.TaikoNo,
			&history.Score,
		); err != nil {
			continue
		}
		histories = append(histories, history)
	}

	slices.SortFunc(histories, func(a CompeHistory, b CompeHistory) int {
		return b.Score - a.Score
	})

	return histories, nil
}
