import pandas
import codecs
from random import randint
from random import sample
from random import shuffle
import numpy as np
import json
import copy

def create_doc(username, max_number_of_sessions, course_topics, groups_len):
    course_topics = copy.deepcopy(course_topics)
    doc = {}
    doc["username"] = username
    doc["user_sessions"] = []
    user_number_of_sessions = randint(10, max_number_of_sessions)


    topic_list = list(course_topics)
    shuffle(topic_list)

    req_topic_ranges = [[0, groups_len[0]]]
    acc = groups_len[0]
    for i in range(1, len(groups_len)):
        acc += groups_len[i]
        req_topic_ranges.append([acc - groups_len[i], acc])

    data_groups_no = len(groups_len)
    (q, r) = divmod(user_number_of_sessions, data_groups_no - 1)
    sessions_len = [q for i in range(data_groups_no - 1)]
    if r != 0:
        sessions_len.append(r)

    for idx, s in enumerate(sessions_len):
        for session in range(s):
            topic_range = req_topic_ranges[idx]
            user_number_of_topics_covered = min(len(course_topics), max([1, min([topic_range[1]-topic_range[0], np.random.poisson(2.5)])])) #number of topics usually covered in one session are assumed 2
            session_topics = sample(topic_list[topic_range[0]:topic_range[1]], user_number_of_topics_covered)
            session_topics.sort()
            t1 = []
            for topic in session_topics:
                if(course_topics[topic] <= 0):
                    continue

                session_info = {}
                session_info["topic_name"] = topic
                number_of_questions =  min(randint(1, course_topics[topic]), 3)
                session_info["number_of_questions"] = number_of_questions
                course_topics[topic] -= number_of_questions
                t1.append(session_info)
            doc["user_sessions"].append(t1)
    return doc


if __name__ == "__main__":
    course_topics = {}
    topic_list = []
    with codecs.open('Java__Quiz_Questions.csv', "r", encoding='utf-8', errors='ignore') as fdata:
        csv = pandas.read_csv(fdata)
        for idx, row in csv.iterrows():
            if row["courseTopic"] in course_topics:
                course_topics[row["courseTopic"]] += 1
            else:
                course_topics[row["courseTopic"]] = 1
                topic_list.append(row["courseTopic"])

    number_of_users = 50
    max_number_of_sessions = 30
    total_number_of_topics = len(course_topics)

    f = open('topic_list.js', 'w')
    f.write("var topic_list = \n")
    json.dump(topic_list, f, indent=4, separators=(',', ":"))
    f.write(";")
    f.close()

    data_groups_no = 5
    (q, r) = divmod(total_number_of_topics, data_groups_no - 1)
    groups_len = [q for i in range(data_groups_no - 1)]
    if r != 0:
        groups_len.append(r)

    all_docs = []
    for i in range(number_of_users):
        all_docs.append(create_doc('user' + str(i + 1), max_number_of_sessions, course_topics, groups_len))

    f = open('user_session_history.js', 'w')
    f.write("var user_session_history = \n")
    json.dump(all_docs, f, indent=4, separators=(',', ':'))
    f.write(";")
    f.close()

