class PostsController < ApplicationController
  before_action :set_post, only: [:show, :update, :destroy]
before_action :authorize_request, only: [:create]
  # GET /posts
  def index
        @posts = Post.all
        render json: @posts
        # @posts = Post.paginate(page: params[:page], per_page: 5)

    end


  # GET /posts/1
  def show
    @user = User.find(params[:user_id])
        render json: @user.posts
      end

  # POST /posts
  def create
    @post = Post.new(post_params)
    @post.user = @current_user
    if @post.save
      render json: @post, status: :created, location: @post
    else
      render json: @post.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /posts/1
  def update
    if @post.update(post_params)
      render json: @post
    else
      render json: @post.errors, status: :unprocessable_entity
    end
  end

  # DELETE /posts/1
  def destroy
    @post.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_post
      @post = Post.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def post_params
      params.require(:post).permit(:title, :description, :body, :user_id, :category_id, :username)
    end
end
