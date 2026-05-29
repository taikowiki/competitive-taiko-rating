package server

import (
	"strconv"

	"github.com/gin-gonic/gin"
)

func (s *Server) CurrentSession(c *gin.Context) {
	session_db, err := s.db.GetCurrentSession()
	if err != nil {
		c.Status(500)
		return
	}

	if session_db == nil {
		c.JSON(200, nil)
		return
	}

	diff1, _ := strconv.Atoi(session_db.Diff1)
	diff2, _ := strconv.Atoi(session_db.Diff2)
	diff3, _ := strconv.Atoi(session_db.Diff3)

	song1Title, song1Level := s.cache.GetSongInfo(session_db.SongNo1, diff1)
	song2Title, song2Level := s.cache.GetSongInfo(session_db.SongNo2, diff2)
	song3Title, song3Level := s.cache.GetSongInfo(session_db.SongNo3, diff3)

	songs := []Song{
		{
			SongNo: session_db.SongNo1,
			Title:  song1Title,
			Level:  song1Level,
			Diff:   session_db.Diff1,
		},
		{
			SongNo: session_db.SongNo2,
			Title:  song2Title,
			Level:  song2Level,
			Diff:   session_db.Diff2,
		},
		{
			SongNo: session_db.SongNo3,
			Title:  song3Title,
			Level:  song3Level,
			Diff:   session_db.Diff3,
		},
	}

	session := Session{
		Season:  session_db.Season,
		Session: session_db.Session,
		Songs:   songs,
		Start:   session_db.StartDate,
		End:     session_db.EndDate,
	}
	c.JSON(200, session)
}

func (s *Server) CurrentHirobaCompeIds(c *gin.Context) {
	compeIds, err := s.db.GetCurrentHirobaCompeIds()
	if err != nil {
		c.Status(500)
		return
	}

	c.JSON(200, compeIds)
}
