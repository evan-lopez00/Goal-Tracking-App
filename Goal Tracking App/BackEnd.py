#comment


import asana
from asana.rest import ApiException
from pprint import pprint
import datetime
import pprint
import random 
import json
import requests
from flask import Flask, render_template, redirect, url_for, jsonify, request
from flask_cors import CORS, cross_origin



access_token = '2/1207126577252821/1207126487695962:79f428fbf38650c2263555028f8aff7e'
workspace = '1207126577252832'
admin_id = '1207126577252821'
time_line = '1207126457626186'

configuration = asana.Configuration()
configuration.access_token = access_token
api_client = asana.ApiClient(configuration)
goals_api_instance = asana.GoalsApi(api_client)



binId = '66247259acd3cb34a83bfbfe'
GoalsBinID = '662470e0ad19ca34f85d8482'
apiKey = '$2a$10$.EkYcwpjcboIASxi2m5V1e0npd.iETPvyTCThCNLGOEvy.Tdu/ZSK'

USER_DATA_URL = 'https://api.jsonbin.io/v3/b/{binId}'



app = Flask(__name__)
CORS(app)
users = []
usergoals = []

headers = {
  'Content-Type': 'application/json',
  'X-Master-Key': apiKey
}

#create User class
class User:
    def __init__(self):
       self.user_data = {
        "id" : "",
        "first name" : "",
        "last name" : "",
        "password" : "",
        "email" : ""
       }

    def setEmail(self, email):
       self.user_data["email"] = email
    
    def getEmail(self):
        return self.user_data["email"]
    
    def setFirstName(self, firstName):
        self.user_data["first name"] = firstName
    
    def getFirstName(self):
        return self.user_data["first name"]

    def setLastName(self, lastName):
        self.user_data["last name"] = lastName

    def getLastName(self):
        return self.user_data["last name"]
    
    def setPassword(self, password):
        self.user_data["password"] = password
    
    def getPassword(self):
        return self.user_data["password"]
    
    def setId(self):
        self.user_data["id"] = random.randint(0, 9999) 
    
    def getId(self):
        return self.user_data["id"]


#createGoal
def CreateGoal(name, notes, due_on, start_on):
    body = {
        "data": {
            "name": name,
            "notes": notes,
            "due_on": due_on,
            "start_on": start_on,
            "liked": False,
            "workspace": workspace,  # Assuming workspace and other variables are defined elsewhere
            "time_period": time_line,
            "owner": admin_id
        }
    }

    opts = {
        'opt_fields': "current_status_update,current_status_update.resource_subtype,current_status_update.title,due_on,followers,followers.name,html_notes,is_workspace_level,liked,likes,likes.user,likes.user.name,metric,metric.can_manage,metric.currency_code,metric.current_display_value,metric.current_number_value,metric.initial_number_value,metric.precision,metric.progress_source,metric.resource_subtype,metric.target_number_value,metric.unit,name,notes,num_likes,owner,owner.name,start_on,status,team,team.name,time_period,time_period.display_name,time_period.end_on,time_period.period,time_period.start_on,workspace,workspace.name",
    }

    user_email = User.getEmail(users[0])  # Assuming User.getEmail is defined

    try:
        result = goals_api_instance.create_goal(body, opts)

        goalinfojson_file = {
            'user_id': user_email,
            'goal_name': result['name'],
            'goal_id': result['gid'],
            'start_date': result['start_on'],
            'due_date': result['due_on'],
            'notes': result['notes'],
            'metric': result['metric']
        }

        url2 = f'https://api.jsonbin.io/v3/b/{GoalsBinID}'
        headers = {'X-Master-Key': apiKey}
        response = requests.get(url2, headers=headers)
        response_json = response.json().get('record', [])


        
        # Appending new goal information directly to the existing JSON array
        response_json.append(goalinfojson_file)

        # Dumping the updated array to JSON
        updatedJson = json.dumps(response_json)

        AddData2(updatedJson, GoalsBinID, apiKey)

    except ApiException as e:
        print("Exception when calling GoalsAPI->create_goal: %s\n" % e)

def SearchExisitingGoals():
    search_id = User.getEmail(users[0])
    user_goals = []

    url2 = f'https://api.jsonbin.io/v3/b/{GoalsBinID}'
    headers = {'X-Master-Key': apiKey}
    response = requests.get(url2, headers=headers)
    response_json = response.json().get('record', [])

    for user_goal in response_json:
        if user_goal.get("user_id") == search_id:
            user_goals.append(user_goal)
    
    usergoals = user_goals
    user_goals = json.dumps(user_goals)
    return user_goals

def DeleteGoalDB(goal_id):
        updated_goals = []

        url2 = f'https://api.jsonbin.io/v3/b/{GoalsBinID}'
        headers = {'X-Master-Key': apiKey}
        response = requests.get(url2, headers=headers)
        goals = response.json().get('record', [])
    
        for goal in goals:
            if goal['goal_id'] != goal_id:
                updated_goals.append(goal)
    
        print(updated_goals)

        updated_goals = json.dumps(updated_goals)

        AddData(updated_goals, GoalsBinID, apiKey)

        return jsonify({'message' : 'Goal deleted successfully'})

def UpdateGoalDB(goalID, newName):
    updated_goals = []

    url2 = f'https://api.jsonbin.io/v3/b/{GoalsBinID}'
    headers = {'X-Master-Key': apiKey}
    response = requests.get(url2, headers=headers)
    goals = response.json().get('record', [])

    for goal in goals:
        if goal['goal_id'] == goalID:
            goal['goal_name'] = newName
            updated_goals.append(goal)
        else:
            updated_goals.append(goal)
    
    updated_goals = json.dumps(updated_goals)

    AddData(updated_goals, GoalsBinID, apiKey)

    return jsonify({'message' : 'Goal Updated successfully'})

    


#updateGoal
def UpdateGoal():
    body = {"data": {"param1": "value1", "param2": "value2",}} # dict | The updated fields for the goal.
    goal_gid = "12345" # str | Globally unique identifier for the goal.
    opts = {
    'opt_fields': "current_status_update,current_status_update.resource_subtype,current_status_update.title,due_on,followers,followers.name,html_notes,is_workspace_level,liked,likes,likes.user,likes.user.name,metric,metric.can_manage,metric.currency_code,metric.current_display_value,metric.current_number_value,metric.initial_number_value,metric.precision,metric.progress_source,metric.resource_subtype,metric.target_number_value,metric.unit,name,notes,num_likes,owner,owner.name,start_on,status,team,team.name,time_period,time_period.display_name,time_period.end_on,time_period.period,time_period.start_on,workspace,workspace.name", # list[str] | This endpoint returns a compact resource, which excludes some properties by default. To include those optional properties, set this query parameter to a comma-separated list of the properties you wish to include.
    }

    try:
        result = goals_api_instance.update_goal(body)
    except ApiException as e:
        print("Exception when calling GoalsAPI->update_goal: %s\n" % e)

#deleteGoal
def DeleteGoal():
    goal_gid = "12345"

    try:
        result = goals_api_instance.delete_goal(goal_gid)
    except ApiException as e:
        print("Exception when calling GoalsApi->delete_goal: %s\n" % e)



@app.route('/login', methods=['POST'])
def login():
    # Extract email and password from the form
    email = request.form['email']
    password = request.form['password']

    try:

        url2 = f'https://api.jsonbin.io/v3/b/{binId}'
        headers = {'X-Master-Key': apiKey}
        response = requests.get(url2, headers=headers)
        user_data = response.json().get('record', [])

        # Check if the email and password match any user's credentials
        for user_obj in user_data:
                if user_obj['email'] == email and user_obj['password'] == password:
                    # Redirect to the dashboard upon successful login
                    ExUser = User()
                    ExUser.setEmail(user_obj['email'])
                    ExUser.setFirstName(user_obj['first name'])
                    ExUser.setLastName(user_obj['last name'])
                    ExUser.setPassword(user_obj['password']) 
                    users[0] = ExUser

                    SearchExisitingGoals()

                    return redirect('/dashboard')
        
        # If login fails, redirect back to the login page
        return "BAD REQUEST"

    except requests.RequestException as e:
        # Handle request exceptions
        print(f"Error fetching user data: {e}")
        return 'BAD REQUEST'


@app.route('/landing', methods=['GET'])
def landing():
    return render_template('landing.html')

@app.route('/dashboard')
def dashboard():
    # Render the dashboard template
    existing_goals = SearchExisitingGoals()

    return render_template('dashboard.html', goals=existing_goals)

@app.route('/')
def login_page():
    # Render the login page template
    return render_template('landing.html')

@app.route('/createUser', methods=['POST'])
def createUser():
    # Access form data from the request object
    firstname = request.form['firstName']
    lastname = request.form['lastName']
    email = request.form['email']
    password = request.form['password']
    
    # Create a new User instance
    newUser = User()
    newUser.setFirstName(firstname)
    newUser.setLastName(lastname)
    newUser.setEmail(email)
    newUser.setPassword(password)
    newUser.setId()

    # Create User Specific JSON layout
    userinfojson_file = {
            'id': newUser.getId(),
            'first name' : newUser.getFirstName(),
            'last name' : newUser.getLastName(),
            'password' : newUser.getPassword(),
            'email' : newUser.getEmail()
        }

    url2 = f'https://api.jsonbin.io/v3/b/{binId}'
    headers = {'X-Master-Key': apiKey}
    response = requests.get(url2, headers=headers)
    response_json = response.json().get('record', [])
    # Append the new user to the list of users
    users[0] = newUser

    # Append new user to JSON bin
    response_json.append(userinfojson_file)
    # Convert user data to JSON
    UpdatedJSON = json.dumps(response_json) 
    
    # Call AddData function (assuming it's defined elsewhere)
    AddData(UpdatedJSON, binId, apiKey)
    
    # Return user data and JSON representation
    return  redirect(url_for('dashboard'))

for user in users:
    print(user)

@app.route('/create_goal', methods=['POST'])
def create_goal():
    data = request.json
    name = data['name']
    notes = data['notes']
    due_on = data['due_on']
    start_on = data['start_on']

    CreateGoal(name, notes, due_on, start_on)

    return jsonify({'message': 'Goal created successfully'})

@app.route('/retrieveGoals', methods=['GET'])
def retrieveGoals():
    goals = SearchExisitingGoals()

    goals = json.loads(goals)
    return goals

@app.route('/delete_goal/<goal_id>', methods=['DELETE'])
def delete_goal(goal_id):
        
        DeleteGoalDB(goal_id)

        return jsonify({'message': 'Goal deleted successfully'})

# Modify the route to handle the update request
@app.route('/update_goal/<goal_id>/<name>', methods=['PUT'])
def update_goal(goal_id, name):
    # Call the UpdateGoalDB function with the provided goal_id and name
    result = UpdateGoalDB(goal_id, name)

    if result:
        return jsonify({'message': 'Goal updated successfully'}), 200
    else:
        return jsonify({'message': 'Failed to update goal'}), 400



def AddData(self,binId,apiKey):

    url = f'https://api.jsonbin.io/v3/b/{binId}'

    headers = {
        'X-Master-Key': apiKey,
        'Content-Type': 'application/json'
    }

    response = requests.put(url, self, headers=headers)

    if response.status_code == 200:
        print("Data added to jsonbin.io")
    else:
        print("FAILED to added data:", response.status_code)
    
def AddData2(self,binId,apiKey):

    url = f'https://api.jsonbin.io/v3/b/{binId}'

    headers = {
        'X-Master-Key': apiKey,
        'Content-Type': 'application/json'
    }

    response = requests.put(url, self, headers=headers)
    if response.status_code == 200:
        print("Data added to jsonbin.io")
    else:
        print("FAILED to added data:", response.status_code)

ExUser = User()
ExUser.setEmail('lopeze72@students.rowan.edu')
ExUser.setFirstName('Evan')
ExUser.setLastName('Lopez')
ExUser.setPassword('Password123!')
users.append(ExUser)

if __name__ == '__main__':
    app.run()

