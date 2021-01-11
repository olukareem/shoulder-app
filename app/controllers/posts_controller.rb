class PostsController < ApplicationController
  before_action :set_post, only: [:update, :destroy, :get_one_post]
before_action :authorize_request, only: [:create, :destroy, :update]
  # GET /posts
  def index
        @posts = Post.all
        render json: @posts, include: [:user, :categories]
        # Shows all posts and includes the user and categories
        # @posts = Post.paginate(page: params[:page], per_page: 5)

    end
def get_one_post
    render json: @post
    # Renders a post
end
  # GET /posts/1
  def show
    @user = User.find(params[:user_id])
    #Finds users by the ID number
        render json: @user.posts, include: [:user, :categories]
        #Shows the post and includes categories
      end

  # POST /posts
  def create
    @post = Post.new(post_params)
    @post.user = @current_user
    #Creates new post for current user
    # @post.push(params)
    puts "params", params
    if @post.save
      render json: @post, include: [:user, :categories]
    else
      render json: @post.errors, status: :unprocessable_entity
    end
  end

  def add_category
    @post = Post.find(params[:id])
    #Finds post by Id
    @post.categories << Category.find(params[:category_id])
    #Associates post with category and finds by category ID
end
  # PATCH/PUT /posts/1
  def update
    if @post.update(post_params)
      render json: @post, include: [:user, :categories]
    else
      render json: @post.errors, status: :unprocessable_entity
    end
  end

  # DELETE /posts/1
  def destroy

    @post.destroy
render json: @post
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_post
      @post = Post.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def post_params
      params.require(:post).permit(:title, :description, :body, :category_ids => [])
    end
end
