class ApplicationController < ActionController::API
    # SECRET_KEY = Rails.env == 'production' ? ENV

    # ['SECRET_KEY'] : Rails.application.secrets.secret_key_base.to_s
    skip_before_action :verify_authenticity_token
    helper_method :login!, :logged_in?, :current_user, :authorized_user?, :logout!
  def login!
      session[:user_id] = @user.id
    end
  def logged_in?
      !!session[:user_id]
    end
  def current_user
      @current_user ||= User.find(session[:user_id]) if session[:user_id]
    end
  def authorized_user?
       @user == current_user
     end
  def logout!
       session.clear
     end
  end



    def encode(payload, exp=30.days.from._now)
        payload[:exp] = exp.to_i    
        JWT.encode(payload, SECRET_KEY)
    end
    def decode(token)
        decoded = JWT.decode(token, SECRET_KEY)[0]
        HashWithIndifferentAccess.new decoded
    end
    def authorize_request
        header = request.headers['Authorization']
        header= header.split(' ').last 
        if header 
            begin
                @decoded = decode(header)
                @current_user=User.find(@decoded[:user_id])
            rescue ActiveRecord::RecordNotFound=> e
                render json: {errors:e.message},
                status: :unauthorized
            rescue JWT::DecodeError => e
                render json: {errors: e.message}, status:
                :unauthorized
            end
        end
    end
end