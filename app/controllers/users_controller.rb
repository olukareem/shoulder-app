class UsersController < ApplicationController
  before_action :set_user, only: [:show, :update, :destroy]
before_action :authorize_request, except: :create

  # GET /users
    def index
        @users = User.all

        if @users
            render json: @users
            
        else
            render json: {
            status: 500,
            errors: ['no users found']
            }
        end
    end

  # GET /users/1
    def show  
        @user = User.find(params[:id])
        if @user
        render json: {
            user: @user, include: :posts
        }
        else
        render json: {
            status: 500,
            errors: ['user not found']
        }
        end
    end

  # POST /users
  def create
    @user = User.new(user_params)
    if @user.save
      @token = encode({ user_id: @user.id, username: @user.username })
      render json: { user: @user, token: @token }, status: :created
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /users/1
  def update
    if @current_user.id == params[:id]
    if @user.update(user_params)
      render json: @user
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end
  end

  # DELETE /users/1
    def destroy
        @user.destroy
    end

    def favorite
        @user=User.find(params[:user_id])
        @post=Post.find(params[:post_id])
        @user.posts<<@post
        render json: @user.posts

    end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user
      @user = User.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def user_params
      params.require(:user).permit(:username, :email, :password, :image_url, :full_name, :bio, :contact, :is_anonymous)
    end
end
