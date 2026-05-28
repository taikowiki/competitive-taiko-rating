package db

import (
	"database/sql"
	"log"

	"c-rating-backend/models"
)

func (db *DB) GetLatestCompetition() (*models.Competition, error) {
	query := `SELECT id, season, session, songNo1, songNo2, songNo3, diff1, diff2, diff3, startDate, endDate, checkDate 
			  FROM competition 
			  ORDER BY season DESC, session DESC 
			  LIMIT 1`
	row := db.QueryRow(query)
	var c models.Competition
	err := row.Scan(&c.ID, &c.Season, &c.Session, &c.SongNo1, &c.SongNo2, &c.SongNo3, &c.Diff1, &c.Diff2, &c.Diff3, &c.StartDate, &c.EndDate, &c.CheckDate)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	return &c, nil
}

func (db *DB) GetHirobaCompetitions(season, session int) ([]models.HirobaCompetition, error) {
	query := "SELECT compeId, season, session FROM hiroba_competition WHERE season = ? AND session = ?"
	rows, err := db.Query(query, season, session)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var compes []models.HirobaCompetition
	for rows.Next() {
		var c models.HirobaCompetition
		if err := rows.Scan(&c.CompeID, &c.Season, &c.Session); err != nil {
			log.Printf("[DB] Error scanning hiroba_competition: %v", err)
			continue
		}
		compes = append(compes, c)
	}
	return compes, nil
}

func (db *DB) GetLatestHirobaCompetitions() ([]models.HirobaCompetition, int, int, error) {
	var season, session int
	err := db.QueryRow("SELECT season, session FROM hiroba_competition ORDER BY season DESC, session DESC LIMIT 1").Scan(&season, &session)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, 0, 0, nil
		}
		return nil, 0, 0, err
	}

	compes, err := db.GetHirobaCompetitions(season, session)
	return compes, season, session, err
}

func (db *DB) GetRankings() ([]models.Rating, error) {
	query := "SELECT taikoNo, ranking, rating, RD, Vol FROM rating ORDER BY ranking ASC"
	rows, err := db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var ratings []models.Rating
	for rows.Next() {
		var r models.Rating
		if err := rows.Scan(&r.TaikoNo, &r.Ranking, &r.Rating, &r.RD, &r.Vol); err != nil {
			log.Printf("[DB] Error scanning rating: %v", err)
			continue
		}
		ratings = append(ratings, r)
	}
	return ratings, nil
}

func (db *DB) GetRankingsBySeason(season int) ([]models.SeasonRating, error) {
	query := "SELECT taikoNo, season, rating, ranking FROM season_rating WHERE season = ? ORDER BY ranking ASC"
	rows, err := db.Query(query, season)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var ratings []models.SeasonRating
	for rows.Next() {
		var r models.SeasonRating
		if err := rows.Scan(&r.TaikoNo, &r.Season, &r.Rating, &r.Ranking); err != nil {
			log.Printf("[DB] Error scanning season_rating for ranking: %v", err)
			continue
		}
		ratings = append(ratings, r)
	}
	return ratings, nil
}

func (db *DB) GetPlayerSeasonRatings(taikoNo string) ([]models.SeasonRating, error) {
	query := "SELECT taikoNo, season, rating, ranking FROM season_rating WHERE taikoNo = ? ORDER BY season DESC"
	rows, err := db.Query(query, taikoNo)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var ratings []models.SeasonRating
	for rows.Next() {
		var r models.SeasonRating
		if err := rows.Scan(&r.TaikoNo, &r.Season, &r.Rating, &r.Ranking); err != nil {
			log.Printf("[DB] Error scanning season_rating: %v", err)
			continue
		}
		ratings = append(ratings, r)
	}
	return ratings, nil
}

func (db *DB) GetSessionScores(season, session int) ([]models.HirobaCompetitionHistory, error) {
	query := "SELECT season, session, taikoNo, score FROM hiroba_competition_history WHERE season = ? AND session = ? ORDER BY score DESC"
	rows, err := db.Query(query, season, session)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var scores []models.HirobaCompetitionHistory
	for rows.Next() {
		var s models.HirobaCompetitionHistory
		if err := rows.Scan(&s.Season, &s.Session, &s.TaikoNo, &s.Score); err != nil {
			log.Printf("[DB] Error scanning hiroba_competition_history: %v", err)
			continue
		}
		scores = append(scores, s)
	}
	return scores, nil
}

func (db *DB) GetSeasons() ([]int, error) {
	query := "SELECT DISTINCT season FROM season_rating ORDER BY season DESC"
	rows, err := db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var seasons []int
	for rows.Next() {
		var s int
		if err := rows.Scan(&s); err != nil {
			log.Printf("[DB] Error scanning seasons: %v", err)
			continue
		}
		seasons = append(seasons, s)
	}
	return seasons, nil
}

func (db *DB) GetSessionsBySeason(season int) ([]int, error) {
	query := "SELECT DISTINCT session FROM hiroba_competition_history WHERE season = ? ORDER BY session DESC"
	rows, err := db.Query(query, season)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var sessions []int
	for rows.Next() {
		var s int
		if err := rows.Scan(&s); err != nil {
			log.Printf("[DB] Error scanning sessions: %v", err)
			continue
		}
		sessions = append(sessions, s)
	}
	return sessions, nil
}
