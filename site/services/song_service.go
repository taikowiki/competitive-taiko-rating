package services

import (
	"encoding/json"
	"fmt"
	"net/http"
	"sync"
)

type SongInfo struct {
	Title string `json:"title"`
}

var (
	songCache  = make(map[string]SongInfo)
	cacheMutex sync.RWMutex
)

func GetSongTitle(songNo string) (string, error) {
	cacheMutex.RLock()
	if info, exists := songCache[songNo]; exists {
		cacheMutex.RUnlock()
		return info.Title, nil
	}
	cacheMutex.RUnlock()

	url := fmt.Sprintf("https://taiko.wiki/api/v1/song/no/%s", songNo)
	resp, err := http.Get(url)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("failed to fetch song info: %s", resp.Status)
	}

	var info SongInfo
	if err := json.NewDecoder(resp.Body).Decode(&info); err != nil {
		return "", err
	}

	cacheMutex.Lock()
	songCache[songNo] = info
	cacheMutex.Unlock()

	return info.Title, nil
}
