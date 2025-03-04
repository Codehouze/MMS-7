// Package api (discussion) includes endpoints for the discussion forum.
package api

import (
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/ALCOpenSource/Mentor-Management-System-Team-7/backend/db"
	"github.com/ALCOpenSource/Mentor-Management-System-Team-7/backend/db/models"
	"github.com/ALCOpenSource/Mentor-Management-System-Team-7/backend/internal/token"
	"github.com/gin-gonic/gin"
	"github.com/go-playground/validator/v10"
	"github.com/rs/zerolog/log"
)

type createDiscussionRequest struct {
	Title   string `json:"title" binding:"required"`
	Content string `json:"content" binding:"required"`
}

func (server *Server) createDiscussion(ctx *gin.Context) {
	var req createDiscussionRequest
	if err := bindJSONWithValidation(ctx, ctx.ShouldBindJSON(&req), validator.New()); err != nil {
		return
	}

	authPayload := ctx.MustGet(authorizationPayloadKey).(*token.Payload)

	creator, err := server.store.GetUser(ctx, authPayload.UserID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse("failed to get user info"))
		return
	}

	arg := &models.Discussion{
		Title:   req.Title,
		Content: req.Content,
		Creator: models.CreatorDetails{
			ID: creator.ID,
			ProfileImageURL: creator.ProfileImageURL,
			FullName: fmt.Sprintf("%s %s", creator.FirstName, creator.LastName),
			Role: creator.Role,
		},
		CreatedAt: time.Now(),
		Comments:  []models.Comment{},
		UpdatedAt: time.Now(),
	}

	discussion, err := server.store.CreateDiscussion(ctx, arg)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse("failed to create discussion"))
		return
	}

	ctx.JSON(http.StatusCreated, envelop{"data": discussion})
	log.Info().
		Str("discussion_id", discussion.ID.String()).
		Str("user_id", authPayload.UserID).
		Str("ip_address", ctx.ClientIP()).
		Str("user_agent", ctx.Request.UserAgent()).
		Str("request_method", ctx.Request.Method).
		Str("request_path", ctx.Request.URL.Path).
		Msg("discussion created")
}

type addCommentRequest struct {
	Content   string `json:"content" binding:"required"`
}

type addCommentRequestID struct {
	ID string `uri:"id" binding:"required"`
}

func (server *Server) addComment(ctx *gin.Context) {
	var reqID addCommentRequestID

	if err := bindJSONWithValidation(ctx, ctx.ShouldBindUri(&reqID), validator.New()); err != nil {
		return
	}

	var reqBody addCommentRequest
	if err := bindJSONWithValidation(ctx, ctx.ShouldBindJSON(&reqBody), validator.New()); err != nil {
		return
	}

	authPayload := ctx.MustGet(authorizationPayloadKey).(*token.Payload)

	creator, err := server.store.GetUser(ctx, authPayload.UserID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse("failed to get user info"))
		return
	}

	arg := &models.Comment{
		OwnerID:   creator.ID,
		FullName:  fmt.Sprintf("%s %s", creator.FirstName, creator.LastName),
		Content:   reqBody.Content,
		CreatedAt: time.Now(),
	}

	comments, err := server.store.AddComment(ctx, reqID.ID, arg)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse("failed to parse user's ID"))
		return
	}

	ctx.JSON(http.StatusCreated, envelop{"data": comments})
	log.Info().
		Str("discussion_id", reqID.ID).
		Str("user_id", authPayload.UserID).
		Str("ip_address", ctx.ClientIP()).
		Str("user_agent", ctx.Request.UserAgent()).
		Str("request_method", ctx.Request.Method).
		Str("request_path", ctx.Request.URL.Path).
		Msg("comment added")
}

type listDiscussionsRequest struct {
	PageID   int64 `form:"page_id" binding:"required,min=1"`
	PageSize int64 `form:"page_size" binding:"required,min=5,max=15"`
}

func (server *Server) listDiscussions(ctx *gin.Context) {
	var req listDiscussionsRequest
	if err := bindJSONWithValidation(ctx, ctx.ShouldBindQuery(&req), validator.New()); err != nil {
		return
	}

	authPayload := ctx.MustGet(authorizationPayloadKey).(*token.Payload)

	discussions, err := server.store.ListDiscussions(ctx, authPayload.UserID, req.PageID, req.PageSize)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse("failed to list discussions"))
		return
	}

	ctx.JSON(http.StatusOK, envelop{"data": discussions})
	log.Info().
		Int64("page_id", req.PageID).
		Int64("page_size", req.PageSize).
		Str("user_id", authPayload.UserID).
		Str("ip_address", ctx.ClientIP()).
		Str("user_agent", ctx.Request.UserAgent()).
		Str("request_method", ctx.Request.Method).
		Str("request_path", ctx.Request.URL.Path).
		Msg("listed discussions")
}

type updateDiscussionRequest struct {
	Title   string `json:"title" binding:"required"`
	Content string `json:"content" binding:"required"`
}

type updateDiscussionRequestID struct {
	ID string `uri:"id" binding:"required"`
}

func (server *Server) updateDiscussion(ctx *gin.Context) {
	var reqID updateDiscussionRequestID
	if err := bindJSONWithValidation(ctx, ctx.ShouldBindUri(&reqID), validator.New()); err != nil {
		return
	}

	var reqBody updateDiscussionRequest
	if err := bindJSONWithValidation(ctx, ctx.ShouldBindJSON(&reqBody), validator.New()); err != nil {
		return
	}

	authPayload := ctx.MustGet(authorizationPayloadKey).(*token.Payload)

	discussion, err := server.store.UpdateDiscussion(ctx, reqID.ID, map[string]interface{}{
		"title":      reqBody.Title,
		"content":    reqBody.Content,
		"updated_at": time.Now(),
	})
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, errorResponse("failed to update discussion"))
		return
	}

	ctx.JSON(http.StatusOK, envelop{"data": discussion})
	log.Info().
		Str("discussion_id", reqID.ID).
		Str("user_id", authPayload.UserID).
		Str("ip_address", ctx.ClientIP()).
		Str("user_agent", ctx.Request.UserAgent()).
		Str("request_method", ctx.Request.Method).
		Str("request_path", ctx.Request.URL.Path).
		Msg("discussion updated")
}

type getDiscussionRequestID struct {
	ID string `uri:"id" binding:"required"`
}

func (server *Server) getDiscussion(ctx *gin.Context) {
	var req getDiscussionRequestID
	if err := bindJSONWithValidation(ctx, ctx.ShouldBindUri(&req), validator.New()); err != nil {
		return
	}

	authPayload := ctx.MustGet(authorizationPayloadKey).(*token.Payload)

	discussion, err := server.store.GetDiscussion(ctx, req.ID)
	if err != nil {
		if errors.Is(err, db.ErrRecordNotFound) {
			ctx.JSON(http.StatusNotFound, errorResponse(db.ErrRecordNotFound.Error()))
			return
		}

		ctx.JSON(http.StatusInternalServerError, errorResponse("failed to fetch discussion"))
		return
	}

	ctx.JSON(http.StatusOK, envelop{"data": discussion})
	log.Info().
	Str("discussion_id", req.ID).
	Str("user_id", authPayload.UserID).
	Str("ip_address", ctx.ClientIP()).
	Str("user_agent", ctx.Request.UserAgent()).
	Str("request_method", ctx.Request.Method).
	Str("request_path", ctx.Request.URL.Path).
	Msg("retrieved discussion")
}
