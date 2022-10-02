package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"
	"fmt"
	"mainbackend/database"
	"mainbackend/graph/generated"
	"mainbackend/graph/model"
	"mainbackend/mail"
	"strings"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// Login is the resolver for the Login field.
func (r *mutationResolver) Login(ctx context.Context, input model.InputLogin) (*model.User, error) {
	// panic(fmt.Errorf("not implemented: Login - Login"))
	db := database.GetDB()
	var valuser model.User
	err1 := db.Model(valuser).Where("email LIKE ?", input.Email).Take(&valuser).Error
	if err1 != nil {
		//if error is found (includes if user not found), return nil & err1
		return nil, err1
		// gorm.ErrRecordNotFound
	}

	//google
	if input.Google != "" {
		var valuser2 model.User

		err2 := db.Model(valuser2).Where("google LIKE ?", input.Google).Take(&valuser2).Error
		if err2 != nil {
			return nil, err2
		}
		if valuser2.Google != valuser.Google {
			return nil, nil
		}

		if valuser2.Google != input.Google {
			return nil, nil
		}

		if valuser.Google != input.Google {
			return nil, nil
		}

		return &valuser2, nil
	}

	//password
	if valuser.Password != input.Password {
		return nil, nil
	}
	//if password match
	return &valuser, nil
}

// CreateUser is the resolver for the createUser field.
func (r *mutationResolver) CreateUser(ctx context.Context, input model.InputRegister) (*model.User, error) {
	// panic(fmt.Errorf("not implemented: CreateUser - createUser"))
	db := database.GetDB()
	var valuser model.User
	err1 := db.Model(valuser).Where("email LIKE ?", input.Email).Take(&valuser).Error
	if err1 != nil {
		//if error other than user is found, return nil & err1
		if err1 != gorm.ErrRecordNotFound {
			return nil, err1
		}
	}
	//if user is found, return nil & nil
	if valuser.Email == input.Email {
		return nil, nil
	}

	if input.Google != "" {
		googleUser := &model.User{
			ID:        uuid.NewString(),
			Name:      input.Name,
			Email:     input.Email,
			Username:  input.Username,
			Activated: true,
			Google:    input.Google,
			Profile:   input.Profile,
		}
		err2 := r.DB.Create(googleUser).Error
		return googleUser, err2
	}
	user := &model.User{
		ID:           uuid.NewString(),
		Name:         input.Name,
		Email:        input.Email,
		Username:     input.Username,
		Password:     input.Password,
		ActivationID: uuid.NewString(),
		Google:       input.Google,
	}
	err := r.DB.Create(user).Error
	mail.SendVer(user.Email, user.ActivationID)
	return user, err
}

// ActivateUser is the resolver for the activateUser field.
func (r *mutationResolver) ActivateUser(ctx context.Context, input model.InputActivate) (*model.User, error) {
	// panic(fmt.Errorf("not implemented: ActivateUser - activateUser"))
	db := database.GetDB()
	var valuser model.User
	err1 := db.Model(valuser).Where("activation_id LIKE ?", input.ActivationID).Take(&valuser).Error
	if err1 != nil {
		//if error is found (includes if user not found), return nil & err1
		return nil, err1
		// gorm.ErrRecordNotFound
	}
	err2 := db.Model(valuser).Where("activation_id LIKE ?", input.ActivationID).Update("activated", true).Error
	if err2 != nil {
		//if error is found, return nil & err1
		return nil, err2
	}
	db.Model(valuser).Where("activation_id LIKE ?", input.ActivationID).Take(&valuser)
	return &valuser, nil
}

// ResetPass is the resolver for the resetPass field.
func (r *mutationResolver) ResetPass(ctx context.Context, input model.InputResetPass) (*model.User, error) {
	// panic(fmt.Errorf("not implemented: ResetPass - resetPass"))
	db := database.GetDB()
	var valuser model.User
	err1 := db.Model(valuser).Where("email LIKE ?", input.Email).Take(&valuser).Error
	if err1 != nil {
		//if error is found (includes if user not found), return nil & err1
		return nil, err1
		// gorm.ErrRecordNotFound
	}
	//if user is found
	var resid string = uuid.NewString()
	err2 := db.Model(valuser).Where("email LIKE ?", input.Email).Update("reset_id", resid).Error
	if err2 != nil {
		//if error is found, return nil & err1
		return nil, err1
	}
	mail.SendResetPass(input.Email, resid)
	return &valuser, nil
}

// SetPass is the resolver for the setPass field.
func (r *mutationResolver) SetPass(ctx context.Context, input model.InputNewPass) (*model.User, error) {
	// panic(fmt.Errorf("not implemented: SetPass - setPass"))
	db := database.GetDB()
	var valuser model.User
	err1 := db.Model(valuser).Where("email LIKE ?", input.Email).Take(&valuser).Error
	if err1 != nil {
		//if error is found (includes if user not found), return nil & err1
		return nil, err1
		// gorm.ErrRecordNotFound
	}
	//if user is found
	err2 := db.Model(valuser).Where("email LIKE ?", input.Email).Update("password", input.Password).Error
	if err2 != nil {
		//if error is found, return nil & err1
		return nil, err1
	}
	return &valuser, nil
}

// ResetCode is the resolver for the resetCode field.
func (r *mutationResolver) ResetCode(ctx context.Context, input model.InputResetCode) (*model.User, error) {
	// panic(fmt.Errorf("not implemented: ResetCode - resetCode"))
	var valuser model.User
	db := database.GetDB()
	err1 := db.Model(valuser).Where("reset_id LIKE ?", input.ResetID).Take(&valuser).Error
	if err1 != nil {
		//if error is found (includes if id not found), return nil & err1
		return nil, err1
		// gorm.ErrRecordNotFound
	}
	return &valuser, err1
}

// SendConnect is the resolver for the sendConnect field.
func (r *mutationResolver) SendConnect(ctx context.Context, input *model.InputConnectFollowBlock) (*model.User, error) {
	// panic(fmt.Errorf("not implemented: SendConnect - sendConnect"))
	db := database.GetDB()

	//get first user
	var valuser model.User
	err1 := db.Model(valuser).Where("id LIKE ?", input.ID).Take(&valuser).Error
	if err1 != nil {
		//if error is found (includes if user not found), return nil & err1
		return nil, err1
	}

	//get second user
	var valuser2 model.User
	err2 := db.Model(valuser).Where("id LIKE ?", input.ID2).Take(&valuser2).Error
	if err2 != nil {
		//if error is found (includes if user not found), return nil & err2
		return nil, err2
	}

	fmt.Println(valuser.Connected)
	fmt.Println(valuser2.Connected)
	fmt.Println(valuser2.Requestconnect)

	//temp old slice
	old1 := make([]string, 1, 100)
	old2 := make([]string, 1, 100)
	req2 := make([]string, 1, 100)

	//get id's connected list
	if strings.Contains(valuser.Connected, ",") {
		old1 = strings.Split(valuser.Connected, ",")
	} else {
		old1[0] = valuser.Connected
	}
	//get id2's connected list
	if strings.Contains(valuser2.Connected, ",") {
		old2 = strings.Split(valuser2.Connected, ",")
	} else {
		old2[0] = valuser2.Connected
	}
	//get req2's requestconnect list
	if strings.Contains(valuser2.Requestconnect, ",") {
		req2 = strings.Split(valuser2.Requestconnect, ",")
	} else {
		req2[0] = valuser2.Requestconnect
	}

	//check if id2 exists in id's connected list
	twoExistsinOne := false
	for _, itera1 := range old1 {
		if itera1 == input.ID2 {
			twoExistsinOne = true
			break
		}
		twoExistsinOne = false
	}
	//check if id exists in id2's connected list
	oneExistsinTwo := false
	for _, itera2 := range old2 {
		if itera2 == input.ID {
			oneExistsinTwo = true
			break
		}
		oneExistsinTwo = false
	}
	//check if id exists in id2's connect request list
	oneRequestingtoTwo := false
	for _, itera3 := range req2 {
		if itera3 == input.ID {
			oneRequestingtoTwo = true
			break
		}
		oneRequestingtoTwo = false
	}

	//temp new array
	new1 := make([]string, 1, 100)
	new2 := make([]string, 1, 100)
	newReq2 := make([]string, 1, 100)
	//if id2 exists in id's connected list && id exists in id2's connected list --> disconnect
	if twoExistsinOne && oneExistsinTwo {
		//iterate id's connected list to remove id2
		templen1 := 0
		for i, itera1 := range old1 {
			if itera1 == input.ID2 {
				continue
			} else {
				old1[templen1] = old1[i]
				templen1++
			}
		}
		new1 = old1[:templen1]

		//iterate id2's connected list to remove id
		templen2 := 0
		for i, itera2 := range old2 {
			if itera2 == input.ID {
				continue
			} else {
				old2[templen2] = old2[i]
				templen2++
			}
		}
		new2 = old2[:templen2]

		//if currently id is requesting to connect to id2 --> cancel request
	} else if oneRequestingtoTwo {
		//iterate id2's req list to remove id
		templen3 := 0
		for i, itera2 := range req2 {
			if itera2 == input.ID {
				continue
			} else {
				req2[templen3] = req2[i]
				templen3++
			}
		}
		newReq2 = req2[:templen3]
		//else --> send request
	} else {
		newReq2 = append(req2, input.ID)
		// //new array for id
		// new1 = append(old1, input.ID2)
		// //new array for id2
		// new2 = append(old2, input.ID)

	}
	//set id's new connected list
	err3 := db.Model(valuser).Where("id LIKE ?", input.ID).Update("connected", strings.Join(new1, ",")).Error
	if err3 != nil {
		//if error is found, return nil & err1
		return nil, err3
		// gorm.ErrRecordNotFound
	}

	//set id2's new connected list
	err4 := db.Model(valuser2).Where("id LIKE ?", input.ID2).Update("connected", strings.Join(new2, ",")).Error
	if err4 != nil {
		//if error is found, return nil & err1
		return nil, err4
		// gorm.ErrRecordNotFound
	}

	//set id2's new request connect list
	err5 := db.Model(valuser2).Where("id LIKE ?", input.ID2).Update("requestconnect", strings.Join(newReq2, ",")).Error
	if err5 != nil {
		//if error is found, return nil & err1
		return nil, err5
		// gorm.ErrRecordNotFound
	}
	return &valuser, nil
}

// AcceptConnect is the resolver for the acceptConnect field.
func (r *mutationResolver) AcceptConnect(ctx context.Context, input *model.InputConnectFollowBlock) (*model.User, error) {
	// panic(fmt.Errorf("not implemented: AcceptConnect - acceptConnect"))
	db := database.GetDB()

	//get first user
	var valuser model.User
	err1 := db.Model(valuser).Where("id LIKE ?", input.ID).Take(&valuser).Error
	if err1 != nil {
		//if error is found (includes if user not found), return nil & err1
		return nil, err1
	}

	//get second user
	var valuser2 model.User
	err2 := db.Model(valuser).Where("id LIKE ?", input.ID2).Take(&valuser2).Error
	if err2 != nil {
		//if error is found (includes if user not found), return nil & err2
		return nil, err2
	}

	fmt.Println(valuser.Connected)
	fmt.Println(valuser.Requestconnect)
	fmt.Println(valuser2.Connected)

	//temp old slice
	old1 := make([]string, 1, 100)
	req1 := make([]string, 1, 100)
	old2 := make([]string, 1, 100)

	//get id's connected list
	if strings.Contains(valuser.Connected, ",") {
		old1 = strings.Split(valuser.Connected, ",")
	} else {
		old1[0] = valuser.Connected
	}
	//get req1's requestconnect list
	if strings.Contains(valuser.Requestconnect, ",") {
		req1 = strings.Split(valuser.Requestconnect, ",")
	} else {
		req1[0] = valuser.Requestconnect
	}
	// fmt.Println(req1)
	//get id2's connected list
	if strings.Contains(valuser2.Connected, ",") {
		old2 = strings.Split(valuser2.Connected, ",")
	} else {
		old2[0] = valuser2.Connected
	}
	//temp new array
	new1 := make([]string, 1, 100)
	newReq1 := make([]string, 1, 100)
	new2 := make([]string, 1, 100)

	//iterate id's req list to remove id2
	templen3 := 0
	for i, itera2 := range req1 {
		if itera2 == input.ID2 {
			continue
		} else {
			req1[templen3] = req1[i]
			templen3++
		}
	}
	newReq1 = req1[:templen3]

	//add id to id2's connected list
	new1 = append(old1, input.ID2)
	//add id2 to id's connected list
	new2 = append(old2, input.ID)

	//set id's new connected list
	err3 := db.Model(valuser).Where("id LIKE ?", input.ID).Update("connected", strings.Join(new1, ",")).Error
	if err3 != nil {
		//if error is found, return nil & err1
		return nil, err3
		// gorm.ErrRecordNotFound
	}

	//set id2's new connected list
	err4 := db.Model(valuser2).Where("id LIKE ?", input.ID2).Update("connected", strings.Join(new2, ",")).Error
	if err4 != nil {
		//if error is found, return nil & err1
		return nil, err4
		// gorm.ErrRecordNotFound
	}

	//set id's new request connect list
	err5 := db.Model(valuser).Where("id LIKE ?", input.ID).Update("requestconnect", strings.Join(newReq1, ",")).Error
	if err5 != nil {
		//if error is found, return nil & err1
		return nil, err5
		// gorm.ErrRecordNotFound
	}
	return &valuser, nil
}

// ToggleFollow is the resolver for the toggleFollow field.
func (r *mutationResolver) ToggleFollow(ctx context.Context, input *model.InputConnectFollowBlock) (*model.User, error) {
	// panic(fmt.Errorf("not implemented: ToggleFollow - toggleFollow"))
	db := database.GetDB()

	//get first user
	var valuser model.User
	err1 := db.Model(valuser).Where("id LIKE ?", input.ID).Take(&valuser).Error
	if err1 != nil {
		//if error is found (includes if user not found), return nil & err1
		return nil, err1
	}

	fmt.Println(valuser.Followed)

	//temp old slice
	old1 := make([]string, 1, 100)

	//get id's followed list
	if strings.Contains(valuser.Followed, ",") {
		old1 = strings.Split(valuser.Followed, ",")
	} else {
		old1[0] = valuser.Followed
	}

	//check if id2 exists in id's followed list
	twoExistsinOne := false
	for _, itera1 := range old1 {
		if itera1 == input.ID2 {
			twoExistsinOne = true
			break
		}
		twoExistsinOne = false
	}

	//temp new array
	new1 := make([]string, 1, 100)
	//if id2 exists in id's followed list --> unfollow
	if twoExistsinOne {
		//iterate id's followed list to remove id2
		templen1 := 0
		for i, itera1 := range old1 {
			if itera1 == input.ID2 {
				continue
			} else {
				old1[templen1] = old1[i]
				templen1++
			}
		}
		new1 = old1[:templen1]
		//if id2 not exists in id's followed list --> follow
	} else {
		// newReq2 = append(req2, input.ID)
		// new array for id
		new1 = append(old1, input.ID2)
		// //new array for id2
		// new2 = append(old2, input.ID)

	}
	//set id's new follow list
	err3 := db.Model(valuser).Where("id LIKE ?", input.ID).Update("followed", strings.Join(new1, ",")).Error
	if err3 != nil {
		//if error is found, return nil & err1
		return nil, err3
		// gorm.ErrRecordNotFound
	}
	return &valuser, nil
}

// ToggleBlock is the resolver for the toggleBlock field.
func (r *mutationResolver) ToggleBlock(ctx context.Context, input *model.InputConnectFollowBlock) (*model.User, error) {
	// panic(fmt.Errorf("not implemented: ToggleBlock - toggleBlock"))
	db := database.GetDB()

	//get first user
	var valuser model.User
	err1 := db.Model(valuser).Where("id LIKE ?", input.ID).Take(&valuser).Error
	if err1 != nil {
		//if error is found (includes if user not found), return nil & err1
		return nil, err1
	}

	fmt.Println(valuser.Blocked)

	//temp old slice
	old1 := make([]string, 1, 100)

	//get id's blocked list
	if strings.Contains(valuser.Blocked, ",") {
		old1 = strings.Split(valuser.Blocked, ",")
	} else {
		old1[0] = valuser.Blocked
	}

	//check if id2 exists in id's blocked list
	twoExistsinOne := false
	for _, itera1 := range old1 {
		if itera1 == input.ID2 {
			twoExistsinOne = true
			break
		}
		twoExistsinOne = false
	}

	//temp new array
	new1 := make([]string, 1, 100)
	//if id2 exists in id's blocked list --> unblock
	if twoExistsinOne {
		//iterate id's blocked list to remove id2
		templen1 := 0
		for i, itera1 := range old1 {
			if itera1 == input.ID2 {
				continue
			} else {
				old1[templen1] = old1[i]
				templen1++
			}
		}
		new1 = old1[:templen1]
		//if id2 not exists in id's blocked list --> block
	} else {
		// newReq2 = append(req2, input.ID)
		// new array for id
		new1 = append(old1, input.ID2)
		// //new array for id2
		// new2 = append(old2, input.ID)

	}
	//set id's new follow list
	err3 := db.Model(valuser).Where("id LIKE ?", input.ID).Update("blocked", strings.Join(new1, ",")).Error
	if err3 != nil {
		//if error is found, return nil & err1
		return nil, err3
		// gorm.ErrRecordNotFound
	}
	return &valuser, nil
}

// AddView is the resolver for the addView field.
func (r *mutationResolver) AddView(ctx context.Context, username string) (*model.User, error) {
	// panic(fmt.Errorf("not implemented: AddView - addView"))
	db := database.GetDB()
	var valuser model.User
	err1 := db.Model(valuser).Where("username LIKE ?", username).Take(&valuser).Error
	if err1 != nil {
		//if error is found (includes if user not found), return nil & err1
		return nil, err1
		// gorm.ErrRecordNotFound
	}
	//if id match
	newview := valuser.Views + 1
	err2 := db.Model(valuser).Where("username LIKE ?", username).Update("views", newview).Error
	if err2 != nil {
		//if error is found, return nil & err1
		return nil, err1
	}
	return &valuser, nil
}

// SetProfile is the resolver for the setProfile field.
func (r *mutationResolver) SetProfile(ctx context.Context, input model.InputUpdateProfile) (*model.User, error) {
	// panic(fmt.Errorf("not implemented: SetProfile - setProfile"))
	db := database.GetDB()
	var valuser model.User
	err1 := db.Model(valuser).Where("id LIKE ?", input.ID).Take(&valuser).Error
	if err1 != nil {
		return nil, err1
	}

	valuser.Profile = input.Profile
	valuser.Cover = input.Cover
	valuser.Name = input.Name
	valuser.Headline = input.Headline

	err2 := db.Model(valuser).Where("id LIKE ?", input.ID).Save(&valuser).Error
	if err2 != nil {
		return nil, err2
	}
	return &valuser, nil
}

// CreateExp is the resolver for the createExp field.
func (r *mutationResolver) CreateExp(ctx context.Context, input model.InputExperience) (*model.Experience, error) {
	// panic(fmt.Errorf("not implemented: CreateExp - createExp"))
	expe := &model.Experience{
		ID:        uuid.NewString(),
		UserID:    input.UserID,
		Title:     input.Title,
		Type:      input.Type,
		Company:   input.Company,
		Country:   input.Country,
		IsActive:  input.IsActive,
		StartYear: input.StartYear,
		EndYear:   input.EndYear,
	}
	err := r.DB.Create(expe).Error
	return expe, err
}

// SetExp is the resolver for the setExp field.
func (r *mutationResolver) SetExp(ctx context.Context, input model.InputSetExperience) (*model.Experience, error) {
	// panic(fmt.Errorf("not implemented: SetExp - setExp"))
	db := database.GetDB()
	var expe model.Experience
	err1 := db.Model(expe).Where("id LIKE ?", input.ID).Take(&expe).Error
	if err1 != nil {
		return nil, err1
	}

	expe.Title = input.Title
	expe.Type = input.Type
	expe.Company = input.Company
	expe.Country = input.Country
	expe.IsActive = input.IsActive
	expe.StartYear = input.StartYear
	expe.EndYear = input.EndYear

	err2 := db.Model(expe).Where("id LIKE ?", input.ID).Save(&expe).Error
	if err2 != nil {
		return nil, err2
	}
	return &expe, nil
}

// DeleteExp is the resolver for the deleteExp field.
func (r *mutationResolver) DeleteExp(ctx context.Context, id string) (*model.Experience, error) {
	// panic(fmt.Errorf("not implemented: DeleteExp - deleteExp"))
	db := database.GetDB()
	var expe model.Experience
	err1 := db.Model(expe).Where("id LIKE ?", id).Delete(&expe).Error
	if err1 != nil {
		return nil, err1
	}
	return &expe, nil
}

// CreateEdu is the resolver for the createEdu field.
func (r *mutationResolver) CreateEdu(ctx context.Context, input model.InputEducation) (*model.Education, error) {
	// panic(fmt.Errorf("not implemented: CreateEdu - createEdu"))
	edu := &model.Education{
		ID:          uuid.NewString(),
		UserID:      input.UserID,
		Institution: input.Institution,
		Degree:      input.Degree,
		Field:       input.Field,
		Grade:       input.Grade,
		IsActive:    input.IsActive,
		StartYear:   input.StartYear,
		EndYear:     input.EndYear,
		Activities:  input.Activities,
		Desc:        input.Desc,
	}
	err := r.DB.Create(edu).Error
	return edu, err
}

// SetEdu is the resolver for the setEdu field.
func (r *mutationResolver) SetEdu(ctx context.Context, input model.InputSetEducation) (*model.Education, error) {
	// panic(fmt.Errorf("not implemented: SetEdu - setEdu"))
	db := database.GetDB()
	var edu model.Education
	err1 := db.Model(edu).Where("id LIKE ?", input.ID).Take(&edu).Error
	if err1 != nil {
		return nil, err1
	}

	edu.Institution = input.Institution
	edu.Degree = input.Degree
	edu.Field = input.Field
	edu.Grade = input.Grade
	edu.IsActive = input.IsActive
	edu.StartYear = input.StartYear
	edu.EndYear = input.EndYear
	edu.Activities = input.Activities
	edu.Desc = input.Desc

	err2 := db.Model(edu).Where("id LIKE ?", input.ID).Save(&edu).Error
	if err2 != nil {
		return nil, err2
	}
	return &edu, nil
}

// DeleteEdu is the resolver for the deleteEdu field.
func (r *mutationResolver) DeleteEdu(ctx context.Context, id string) (*model.Education, error) {
	// panic(fmt.Errorf("not implemented: DeleteEdu - deleteEdu"))
	db := database.GetDB()
	var edu model.Education
	err1 := db.Model(edu).Where("id LIKE ?", id).Delete(&edu).Error
	if err1 != nil {
		return nil, err1
	}
	return &edu, nil
}

// CreateHashtag is the resolver for the createHashtag field.
func (r *mutationResolver) CreateHashtag(ctx context.Context, content string) (*model.Hashtag, error) {
	// panic(fmt.Errorf("not implemented: CreateHashtag - createHashtag"))
	htag := &model.Hashtag{
		ID:      uuid.NewString(),
		Content: content,
	}
	err := r.DB.Create(htag).Error
	return htag, err
}

// CreatePost is the resolver for the createPost field.
func (r *mutationResolver) CreatePost(ctx context.Context, input *model.InputPost) (*model.Post, error) {
	// panic(fmt.Errorf("not implemented: CreatePost - createPost"))
	fmt.Println(input.Postdate)
	post := &model.Post{
		ID:       uuid.NewString(),
		Poster:   input.Poster,
		Content:  input.Content,
		Image:    input.Image,
		Video:    input.Video,
		Postdate: input.Postdate,
	}

	err := r.DB.Create(post).Error
	return post, err
}

// SetPost is the resolver for the setPost field.
func (r *mutationResolver) SetPost(ctx context.Context, input *model.InputSetPost) (*model.Post, error) {
	// panic(fmt.Errorf("not implemented: SetPost - setPost"))
	db := database.GetDB()
	var post model.Post
	err1 := db.Model(post).Where("id LIKE ?", input.ID).Take(&post).Error
	if err1 != nil {
		return nil, err1
	}

	post.Content = input.Content
	post.Image = input.Image
	post.Video = input.Video

	err2 := db.Model(post).Where("id LIKE ?", input.ID).Save(&post).Error
	if err2 != nil {
		return nil, err2
	}
	return &post, nil
}

// DeletePost is the resolver for the deletePost field.
func (r *mutationResolver) DeletePost(ctx context.Context, id string) (*model.Post, error) {
	// panic(fmt.Errorf("not implemented: DeletePost - deletePost"))
	db := database.GetDB()
	var post model.Post
	err1 := db.Model(post).Where("id LIKE ?", id).Delete(&post).Error
	if err1 != nil {
		return nil, err1
	}
	return &post, nil
}

// ToggleLike is the resolver for the toggleLike field.
func (r *mutationResolver) ToggleLike(ctx context.Context, input *model.InputLikePost) (*model.Post, error) {
	// panic(fmt.Errorf("not implemented: ToggleLike - toggleLike"))
	db := database.GetDB()

	//get likes list
	var likers model.Post
	err1 := db.Model(likers).Where("id LIKE ?", input.ID).Take(&likers).Error
	if err1 != nil {
		//if error is found (includes if user not found), return nil & err1
		return nil, err1
	}

	fmt.Println(likers.Liker)

	//temp old slice
	old1 := make([]string, 1, 100)

	//get id's like list
	if strings.Contains(likers.Liker, ",") {
		old1 = strings.Split(likers.Liker, ",")
	} else {
		old1[0] = likers.Liker
	}

	alreadyExist := false
	for _, itera1 := range old1 {
		if itera1 == input.Liker {
			alreadyExist = true
			break
		}
		alreadyExist = false
	}

	//temp new array
	new1 := make([]string, 1, 100)
	//if liker exists in likers list --> unlike
	if alreadyExist {
		//iterate like list to remove like
		templen1 := 0
		for i, itera1 := range old1 {
			if itera1 == input.Liker {
				continue
			} else {
				old1[templen1] = old1[i]
				templen1++
			}
		}
		new1 = old1[:templen1]
		//if not exists --> like
	} else {
		// new array for id
		new1 = append(old1, input.Liker)

	}
	//set new like list
	err3 := db.Model(likers).Where("id LIKE ?", input.ID).Update("liker", strings.Join(new1, ",")).Error
	if err3 != nil {
		//if error is found, return nil & err1
		return nil, err3
		// gorm.ErrRecordNotFound
	}

	//get new likes list
	err4 := db.Model(likers).Where("id LIKE ?", input.ID).Take(&likers).Error
	if err4 != nil {
		//if error is found (includes if user not found), return nil & err1
		return nil, err1
	}
	return &likers, nil
}

// CreateComment is the resolver for the createComment field.
func (r *mutationResolver) CreateComment(ctx context.Context, input *model.InputComment) (*model.Comment, error) {
	// panic(fmt.Errorf("not implemented: CreateComment - createComment"))
	comm := &model.Comment{
		ID:            uuid.NewString(),
		ParentPost:    input.ParentPost,
		ParentComment: input.ParentComment,
		Commenter:     input.Commenter,
		Content:       input.Content,
		Postdate:      input.Postdate,
	}
	err := r.DB.Create(comm).Error
	return comm, err
}

// SetComment is the resolver for the setComment field.
func (r *mutationResolver) SetComment(ctx context.Context, input *model.InputSetComment) (*model.Comment, error) {
	// panic(fmt.Errorf("not implemented: SetComment - setComment"))
	db := database.GetDB()
	var comm model.Comment
	err1 := db.Model(comm).Where("id LIKE ?", input.ID).Take(&comm).Error
	if err1 != nil {
		return nil, err1
	}

	comm.Content = input.Content

	err2 := db.Model(comm).Where("id LIKE ?", input.ID).Save(&comm).Error
	if err2 != nil {
		return nil, err2
	}
	return &comm, nil
}

// DeleteComment is the resolver for the deleteComment field.
func (r *mutationResolver) DeleteComment(ctx context.Context, id string) (*model.Comment, error) {
	// panic(fmt.Errorf("not implemented: DeleteComment - deleteComment"))
	db := database.GetDB()
	var comm model.Comment
	err1 := db.Model(comm).Where("id LIKE ?", id).Delete(&comm).Error
	if err1 != nil {
		return nil, err1
	}
	return &comm, nil
}

// ToggleLikeComment is the resolver for the toggleLikeComment field.
func (r *mutationResolver) ToggleLikeComment(ctx context.Context, input *model.InputLikeComment) (*model.Comment, error) {
	// panic(fmt.Errorf("not implemented: ToggleLikeComment - toggleLikeComment"))
	// panic(fmt.Errorf("not implemented: ToggleLike - toggleLike"))
	db := database.GetDB()

	//get likes list
	var likers model.Comment
	err1 := db.Model(likers).Where("id LIKE ?", input.ID).Take(&likers).Error
	if err1 != nil {
		//if error is found (includes if user not found), return nil & err1
		return nil, err1
	}

	fmt.Println(likers.Liker)

	//temp old slice
	old1 := make([]string, 1, 100)

	//get id's like list
	if strings.Contains(likers.Liker, ",") {
		old1 = strings.Split(likers.Liker, ",")
	} else {
		old1[0] = likers.Liker
	}

	alreadyExist := false
	for _, itera1 := range old1 {
		if itera1 == input.Liker {
			alreadyExist = true
			break
		}
		alreadyExist = false
	}

	//temp new array
	new1 := make([]string, 1, 100)
	//if liker exists in likers list --> unlike
	if alreadyExist {
		//iterate like list to remove like
		templen1 := 0
		for i, itera1 := range old1 {
			if itera1 == input.Liker {
				continue
			} else {
				old1[templen1] = old1[i]
				templen1++
			}
		}
		new1 = old1[:templen1]
		//if not exists --> like
	} else {
		// new array for id
		new1 = append(old1, input.Liker)

	}
	//set new like list
	err3 := db.Model(likers).Where("id LIKE ?", input.ID).Update("liker", strings.Join(new1, ",")).Error
	if err3 != nil {
		//if error is found, return nil & err1
		return nil, err3
		// gorm.ErrRecordNotFound
	}

	//get new likes list
	err4 := db.Model(likers).Where("id LIKE ?", input.ID).Take(&likers).Error
	if err4 != nil {
		//if error is found (includes if user not found), return nil & err1
		return nil, err1
	}
	return &likers, nil
}

// CreateJob is the resolver for the createJob field.
func (r *mutationResolver) CreateJob(ctx context.Context, input *model.InputNewJobPost) (*model.Job, error) {
	// panic(fmt.Errorf("not implemented: CreateJob - createJob"))
	jobb := &model.Job{
		ID:          uuid.NewString(),
		Poster:      input.Poster,
		Title:       input.Title,
		Company:     input.Company,
		Location:    input.Location,
		Employment:  input.Employment,
		Description: input.Description,
	}
	err := r.DB.Create(jobb).Error
	return jobb, err
}

// Users is the resolver for the users field.
func (r *queryResolver) Users(ctx context.Context) ([]*model.User, error) {
	// panic(fmt.Errorf("not implemented: Users - users"))
	var users []*model.User
	err := r.DB.Find(&users).Error
	return users, err
}

// UserbyID is the resolver for the UserbyID field.
func (r *queryResolver) UserbyID(ctx context.Context, id string) (*model.User, error) {
	// panic(fmt.Errorf("not implemented: UserbyID - UserbyID"))
	db := database.GetDB()
	var valuser model.User
	err1 := db.Model(valuser).Where("id LIKE ?", id).Take(&valuser).Error
	if err1 != nil {
		//if error is found (includes if user not found), return nil & err1
		return nil, err1
		// gorm.ErrRecordNotFound
	}
	//if id match
	return &valuser, nil
}

// UserbyEmail is the resolver for the UserbyEmail field.
func (r *queryResolver) UserbyEmail(ctx context.Context, email string) (*model.User, error) {
	// panic(fmt.Errorf("not implemented: UserbyEmail - UserbyEmail"))
	db := database.GetDB()
	var valuser model.User
	err1 := db.Model(valuser).Where("email LIKE ?", email).Take(&valuser).Error
	if err1 != nil {
		//if error is found (includes if user not found), return nil & err1
		return nil, err1
		// gorm.ErrRecordNotFound
	}
	//if email match
	return &valuser, nil
}

// UserbyUname is the resolver for the UserbyUname field.
func (r *queryResolver) UserbyUname(ctx context.Context, username string) (*model.User, error) {
	// panic(fmt.Errorf("not implemented: UserbyUname - UserbyUname"))
	db := database.GetDB()
	var valuser model.User
	err1 := db.Model(valuser).Where("username LIKE ?", username).Take(&valuser).Error
	if err1 != nil {
		//if error is found (includes if user not found), return nil & err1
		return nil, err1
		// gorm.ErrRecordNotFound
	}
	//if username match
	return &valuser, nil
}

// Experiences is the resolver for the Experiences field.
func (r *queryResolver) Experiences(ctx context.Context) ([]*model.Experience, error) {
	// panic(fmt.Errorf("not implemented: Experiences - Experiences"))
	var experiences []*model.Experience
	err := r.DB.Find(&experiences).Error
	return experiences, err
}

// ExperiencebyID is the resolver for the ExperiencebyID field.
func (r *queryResolver) ExperiencebyID(ctx context.Context, id string) (*model.Experience, error) {
	// panic(fmt.Errorf("not implemented: ExperiencebyID - ExperiencebyID"))
	db := database.GetDB()
	var expe model.Experience
	err1 := db.Model(expe).Where("id LIKE ?", id).Take(&expe).Error
	if err1 != nil {
		//if error is found (includes if expe not found), return nil & err1
		return nil, err1
		// gorm.ErrRecordNotFound
	}
	//if id match
	return &expe, nil
}

// ExperiencesbyUserID is the resolver for the ExperiencesbyUserID field.
func (r *queryResolver) ExperiencesbyUserID(ctx context.Context, userID string) ([]*model.Experience, error) {
	// panic(fmt.Errorf("not implemented: ExperiencesbyUserID - ExperiencesbyUserID"))
	var experiences []*model.Experience
	err := r.DB.Where("user_id LIKE ?", userID).Find(&experiences).Error
	if err != nil {
		//if error is found (includes if expe not found), return nil & err1
		return nil, err
		// gorm.ErrRecordNotFound
	}
	//if id match
	return experiences, nil
}

// Education is the resolver for the Education field.
func (r *queryResolver) Education(ctx context.Context) ([]*model.Education, error) {
	// panic(fmt.Errorf("not implemented: Education - Education"))
	var educations []*model.Education
	err := r.DB.Find(&educations).Error
	return educations, err
}

// EducationbyID is the resolver for the EducationbyID field.
func (r *queryResolver) EducationbyID(ctx context.Context, id string) (*model.Education, error) {
	// panic(fmt.Errorf("not implemented: EducationbyID - EducationbyID"))
	db := database.GetDB()
	var edu model.Education
	err1 := db.Model(edu).Where("id LIKE ?", id).Take(&edu).Error
	if err1 != nil {
		//if error is found (includes if expe not found), return nil & err1
		return nil, err1
		// gorm.ErrRecordNotFound
	}
	//if id match
	return &edu, nil
}

// EducationsbyUserID is the resolver for the EducationsbyUserID field.
func (r *queryResolver) EducationsbyUserID(ctx context.Context, userID string) ([]*model.Education, error) {
	// panic(fmt.Errorf("not implemented: EducationsbyUserID - EducationsbyUserID"))
	var educations []*model.Education
	err := r.DB.Where("user_id LIKE ?", userID).Find(&educations).Error
	if err != nil {
		//if error is found (includes if expe not found), return nil & err1
		return nil, err
		// gorm.ErrRecordNotFound
	}
	//if id match
	return educations, nil
}

// Hashtag is the resolver for the Hashtag field.
func (r *queryResolver) Hashtag(ctx context.Context) ([]*model.Hashtag, error) {
	// panic(fmt.Errorf("not implemented: Hashtag - Hashtag"))
	var hashtags []*model.Hashtag
	err := r.DB.Find(&hashtags).Error
	return hashtags, err
}

// HashtagbyID is the resolver for the HashtagbyID field.
func (r *queryResolver) HashtagbyID(ctx context.Context, id string) (*model.Hashtag, error) {
	// panic(fmt.Errorf("not implemented: HashtagbyID - HashtagbyID"))
	db := database.GetDB()
	var htag model.Hashtag
	err1 := db.Model(htag).Where("id LIKE ?", id).Take(&htag).Error
	if err1 != nil {
		//if error is found (includes if htag not found), return nil & err1
		return nil, err1
		// gorm.ErrRecordNotFound
	}
	//if id match
	return &htag, nil
}

// HashtagbyText is the resolver for the HashtagbyText field.
func (r *queryResolver) HashtagbyText(ctx context.Context, content string) (*model.Hashtag, error) {
	// panic(fmt.Errorf("not implemented: HashtagbyText - HashtagbyText"))
	db := database.GetDB()
	var htag model.Hashtag
	err1 := db.Model(htag).Where("content LIKE ?", content).Take(&htag).Error
	if err1 != nil {
		//if error is found (includes if htag not found), return nil & err1
		return nil, err1
		// gorm.ErrRecordNotFound
	}
	//if id match
	return &htag, nil
}

// Post is the resolver for the Post field.
func (r *queryResolver) Post(ctx context.Context) ([]*model.Post, error) {
	// panic(fmt.Errorf("not implemented: Post - Post"))
	var posts []*model.Post
	err := r.DB.Find(&posts).Error
	return posts, err
}

// PostbyID is the resolver for the PostbyID field.
func (r *queryResolver) PostbyID(ctx context.Context, id string) (*model.Post, error) {
	// panic(fmt.Errorf("not implemented: PostbyID - PostbyID"))
	db := database.GetDB()
	var post model.Post
	err1 := db.Model(post).Where("id LIKE ?", id).Take(&post).Error
	if err1 != nil {
		//if error is found (includes if post not found), return nil & err1
		return nil, err1
		// gorm.ErrRecordNotFound
	}
	//if id match
	return &post, nil
}

// PostbyPoster is the resolver for the PostbyPoster field.
func (r *queryResolver) PostbyPoster(ctx context.Context, poster string) ([]*model.Post, error) {
	// panic(fmt.Errorf("not implemented: PostbyPoster - PostbyPoster"))
	var posts []*model.Post
	err := r.DB.Where("poster LIKE ?", poster).Find(&posts).Error
	if err != nil {
		//if error is found (includes if expe not found), return nil & err1
		return nil, err
		// gorm.ErrRecordNotFound
	}
	//if id match
	return posts, nil
}

// Comment is the resolver for the Comment field.
func (r *queryResolver) Comment(ctx context.Context) ([]*model.Comment, error) {
	// panic(fmt.Errorf("not implemented: Comment - Comment"))
	var comms []*model.Comment
	err := r.DB.Find(&comms).Error
	return comms, err
}

// CommentbyID is the resolver for the CommentbyID field.
func (r *queryResolver) CommentbyID(ctx context.Context, id string) (*model.Comment, error) {
	// panic(fmt.Errorf("not implemented: CommentbyID - CommentbyID"))
	db := database.GetDB()
	var comm model.Comment
	err1 := db.Model(comm).Where("id LIKE ?", id).Take(&comm).Error
	if err1 != nil {
		//if error is found (includes if post not found), return nil & err1
		return nil, err1
		// gorm.ErrRecordNotFound
	}
	//if id match
	return &comm, nil
}

// CommentsbyPost is the resolver for the CommentsbyPost field.
func (r *queryResolver) CommentsbyPost(ctx context.Context, parentPost string) ([]*model.Comment, error) {
	// panic(fmt.Errorf("not implemented: CommentsbyPost - CommentsbyPost"))
	var comms []*model.Comment
	err := r.DB.Where("parent_post LIKE ?", parentPost).Find(&comms).Error
	if err != nil {
		//if error is found (includes if expe not found), return nil & err1
		return nil, err
		// gorm.ErrRecordNotFound
	}
	//if id match
	return comms, nil
}

// Job is the resolver for the Job field.
func (r *queryResolver) Job(ctx context.Context) ([]*model.Job, error) {
	// panic(fmt.Errorf("not implemented: Job - Job"))
	var jobs []*model.Job
	err := r.DB.Find(&jobs).Error
	return jobs, err
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
