package common

import (
	"encoding/json"
	"io"
)

func ParseBody[T any](body io.ReadCloser) (T, error) {
  var parsedBody T

  readedBody, err := io.ReadAll(body)
  
  if err != nil {
    return parsedBody, err
  }
  
  err = json.Unmarshal(readedBody, &parsedBody)

  if err != nil {
    return parsedBody, err 
  }

  return parsedBody, nil 
}

