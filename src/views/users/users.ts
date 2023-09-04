import { autoinject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-http-client';

import { ICONS } from 'resources/constants/icons';

import './users.scss';

@autoinject
export class Users {

  public icons = ICONS;

  public environments: any = [];
  public selectedEnvironment;

  public organisations: any = [];

  constructor(
    private httpClient: HttpClient
  ) {

    const formattedData = users.map(item => {
      const name = `${item.firstName} ${item.surname}`;
      const email = item.email;
      const password = 'Test1234'; // You can set a default password here if needed
      const role = item.roles[item.roles.length - 1]; // Get the last role from the roles array
    
      return { name, email, password, role };
    });

    console.log(' ::>> users = ', formattedData);

  }

  public bind(): void {
    console.log(' ::>> binded env ');
    this.getEnvironments();
  }

  private getEnvironments(): void {
    this.httpClient
      .createRequest(`http://localhost:9000/environments`)
      .asGet()
      .send()
      .then(data => {
        try {
          this.environments = JSON.parse(data.response);
          console.log(' ::>> environments >>> ', this.environments);
          this.selectEnvironment(this.environments[0]);
        } catch(e) {
          console.log(' > Failed to get environments', e);
        }
      });
  }

  private 

  public selectEnvironment(environment) {
    this.environments.forEach(env => env.selected = false);
    environment.selected = true;
    this.selectedEnvironment = environment;

    this.getOrganisations(environment.name);
  }

  private getOrganisations(environment: string): void {
    this.httpClient
      .createRequest(`http://localhost:9000/organisations`)
      .asGet()
      .withParams({ environment })
      .send()
      .then(data => {
        try {
          this.organisations = JSON.parse(data.response);
          console.log(' ::>> environments >>> ', this.organisations);
        } catch(e) {
          console.log(' > Failed to get organisations', e);
        }
      });
  }
}


const users = [
  {
    "memberId": "0f7339cc-234a-4bc0-a0aa-864beb3aa102",
    "userId": "02a2ffed-0c71-4648-b89e-def17206c3fd",
    "personId": "769c56bb-f889-4c96-9759-f01869387a90",
    "organisationId": "1ec8939f-768e-41a1-a06e-711c064a4de8",
    "firstName": "Meryam",
    "surname": "El Makrini",
    "email": "meryam+@zailab.com",
    "roles": [
      "Administrator"
    ],
    "extension": 10000,
    "devices": [
      {
        "name": "elm3",
        "pin": "5469"
      }
    ]
  },
  {
    "memberId": "ac9a2129-0a05-46a5-888e-6281ceaa4826",
    "userId": "89dc9063-eeba-4276-8862-54c1ffcced37",
    "personId": "57f08e9a-576a-4a4f-bdef-ec62f6865625",
    "organisationId": "1ec8939f-768e-41a1-a06e-711c064a4de8",
    "firstName": "meryam",
    "surname": "admin",
    "email": "meryam11@zailab.com",
    "roles": [
      "Administrator"
    ],
    "extension": 10002,
    "devices": [
      {
        "name": "adm31",
        "pin": "6053"
      }
    ]
  },
  {
    "memberId": "57c1be53-4da0-4590-8b52-9994acb77ece",
    "userId": "2a264ef3-6ac9-498f-99f4-6debdaaadf9b",
    "personId": "1c946556-0c0c-4cfa-9e26-632a11aa21dc",
    "organisationId": "1ec8939f-768e-41a1-a06e-711c064a4de8",
    "firstName": "Test",
    "surname": "QA",
    "email": "john16@zailab.co.uk",
    "roles": [
      "QA"
    ],
    "extension": 10003,
    "devices": [
      {
        "name": "qax9",
        "pin": "6276"
      }
    ]
  },
  {
    "memberId": "cae458c1-64c6-4a00-85d3-6968d72dd519",
    "userId": "b620f233-b482-47b9-a6f4-c68686a599b0",
    "personId": "a329bd7f-9939-4fe7-a0d4-3823010209aa",
    "organisationId": "1ec8939f-768e-41a1-a06e-711c064a4de8",
    "firstName": "Test",
    "surname": "QA Manager",
    "email": "john15@zailab.co.uk",
    "roles": [
      "QA Manager"
    ],
    "extension": 10004,
    "devices": [
      {
        "name": "qam13",
        "pin": "8402"
      }
    ]
  },
  {
    "memberId": "70484e0f-8826-4b39-b330-925dcd0af656",
    "userId": "dadfd59a-e8ea-4488-8a09-a077e77630d5",
    "personId": "1e88b67c-dcfb-40af-b3f5-3b890dc95009",
    "organisationId": "1ec8939f-768e-41a1-a06e-711c064a4de8",
    "firstName": "meryam",
    "surname": "campaign",
    "email": "meryam12@zailab.com",
    "roles": [
      "Campaign Manager"
    ],
    "extension": 10005,
    "devices": [
      {
        "name": "tea42",
        "pin": "4766"
      }
    ]
  },
  {
    "memberId": "0db3c5fe-2d73-40d0-a501-018c83d1bf46",
    "userId": "5301fdd4-85f4-45a3-bbae-e08d7df8150b",
    "personId": "b068cd0c-1195-49bd-91a7-f828a45a5079",
    "organisationId": "1ec8939f-768e-41a1-a06e-711c064a4de8",
    "firstName": "Test",
    "surname": "Teamleader",
    "email": "john14@zailab.co.uk",
    "roles": [
      "Team Leader"
    ],
    "extension": 10006,
    "devices": [
      {
        "name": "tea43",
        "pin": "1416"
      }
    ]
  },
  {
    "memberId": "5e45ddb6-7da0-4598-b149-c4615c3b08ef",
    "userId": "74823239-d1d1-4d71-a7fa-b7eb2ef5e5e5",
    "personId": "2e518d17-cb61-450f-b122-d3a573de8e8c",
    "organisationId": "1ec8939f-768e-41a1-a06e-711c064a4de8",
    "firstName": "meryam",
    "surname": "office employee",
    "email": "meryam14@zailab.com",
    "roles": [
      "Office Employee"
    ],
    "extension": 10007,
    "devices": [
      {
        "name": "off5",
        "pin": "6865"
      }
    ]
  },
  {
    "memberId": "884a9e4d-632c-4495-be70-a938916c6745",
    "userId": "f317dddc-7842-4cc9-aefc-ed75de95d234",
    "personId": "f6e5f2e5-da6b-4cdd-8cd5-a43915f07c96",
    "organisationId": "1ec8939f-768e-41a1-a06e-711c064a4de8",
    "firstName": "Damian",
    "surname": "Team Leader",
    "email": "damian+2@zailab.com",
    "roles": [
      "Team Leader"
    ],
    "extension": 10008,
    "devices": [
      {
        "name": "tea68",
        "pin": "8735"
      }
    ]
  },
  {
    "memberId": "e64fb11e-6d1a-4a9d-bd91-c1650c7d1a6c",
    "userId": "7733c916-e961-4681-bc4b-813476ff6177",
    "personId": "05a905b7-4773-410c-b003-eba91c97c216",
    "organisationId": "1ec8939f-768e-41a1-a06e-711c064a4de8",
    "firstName": "Nicole ",
    "surname": "Agent Testing",
    "email": "nicole15@zailab.com",
    "roles": [
      "Agent"
    ],
    "extension": 10009,
    "devices": [
      {
        "name": "age155",
        "pin": "2761"
      }
    ]
  },
  {
    "memberId": "d107cd1e-aaa1-4b94-ae4e-e39a3cdbe8e7",
    "userId": "065edc85-4f84-4ca7-a1b1-84ced8cb9af8",
    "personId": "bc54d4f3-4bcd-42cd-af65-7bd0d0803b63",
    "organisationId": "1ec8939f-768e-41a1-a06e-711c064a4de8",
    "firstName": "Ilhaam",
    "surname": "Agent",
    "email": "ilhaam+1@zailab.com",
    "roles": [
      "Agent"
    ],
    "extension": 10010,
    "devices": [
      {
        "name": "age156",
        "pin": "4110"
      }
    ]
  },
  {
    "memberId": "e936f851-dc00-4c7a-b348-4ed08af19147",
    "userId": "808dbeea-1044-463f-9c83-03e6e9a1555b",
    "personId": "421063b1-d591-4916-a30e-55da07b7c90f",
    "organisationId": "1ec8939f-768e-41a1-a06e-711c064a4de8",
    "firstName": "Phillip-Juan",
    "surname": "van der Berg",
    "email": "flaap10@zailab.com",
    "roles": [
      "Agent"
    ],
    "extension": 10011,
    "devices": [
      {
        "name": "jan14",
        "pin": "8977"
      }
    ]
  },
  {
    "memberId": "c365da62-f670-4540-85a4-4d9c5505311e",
    "userId": "6535723a-5d35-40c3-9061-dc75f75932c3",
    "personId": "ea56e56e-11c2-42dc-acdc-9bf5e7b94729",
    "organisationId": "1ec8939f-768e-41a1-a06e-711c064a4de8",
    "firstName": "Fred",
    "surname": "Agent",
    "email": "fred5@zailab.co.za",
    "roles": [
      "Agent"
    ],
    "extension": 10012,
    "devices": [
      {
        "name": "age164",
        "pin": "8921"
      }
    ]
  },
  {
    "memberId": "76f4e992-7298-4680-a536-a61e570d0c04",
    "userId": "81496818-176e-4de0-81cd-fcd2205b8aae",
    "personId": "1c7c6d85-163f-43f7-8ebe-0da0b4b6e9e1",
    "organisationId": "1ec8939f-768e-41a1-a06e-711c064a4de8",
    "firstName": "Bruce",
    "surname": "Wayne",
    "email": "yasser2@zailab.com",
    "roles": [
      "Agent"
    ],
    "extension": 10013,
    "devices": [
      {
        "name": "way3",
        "pin": "2704"
      }
    ]
  },
  {
    "memberId": "cac4ed56-09da-42cd-8876-6144fe5d3043",
    "userId": "3a9ac540-9b2c-4196-9d3a-0f5ace008076",
    "personId": "47a293b5-37db-4e16-b0fd-98d256c8683a",
    "organisationId": "1ec8939f-768e-41a1-a06e-711c064a4de8",
    "firstName": "Flaap",
    "surname": "Fifteen",
    "email": "flaap15@zailab.com",
    "roles": [
      "Agent"
    ],
    "extension": 10014,
    "devices": [
      {
        "name": "fif6",
        "pin": "6480"
      }
    ]
  },
  {
    "memberId": "f84db991-5589-4c15-9d56-221777677878",
    "userId": "c0e9ad59-2103-4190-a6a4-2403defdc8f4",
    "personId": "5ca4d549-4112-429b-b766-d5bd4ace50bf",
    "organisationId": "1ec8939f-768e-41a1-a06e-711c064a4de8",
    "firstName": "Gerard",
    "surname": "Agent One",
    "email": "gerard+agent-conversations1@zailab.com",
    "roles": [
      "Agent"
    ],
    "extension": 10015,
    "devices": [
      {
        "name": "age179",
        "pin": "9895"
      }
    ]
  },
  {
    "memberId": "b7181581-9fdb-41a1-9c40-12a69bec7228",
    "userId": "313d4ed7-5e23-47b1-8c7b-459c8fae0db2",
    "personId": "ada1af0a-6262-4604-b5c8-384309d95ad6",
    "organisationId": "1ec8939f-768e-41a1-a06e-711c064a4de8",
    "firstName": "Gerard",
    "surname": "Agent Two",
    "email": "gerard+agent-conversations2@zailab.com",
    "roles": [
      "Agent"
    ],
    "extension": 10016,
    "devices": [
      {
        "name": "age180",
        "pin": "1034"
      }
    ]
  },
  {
    "memberId": "0f4b4f20-8897-4c61-af97-cefce7640b8e",
    "userId": "504935e0-7bde-427a-a38d-518095b715a3",
    "personId": "dc1a6188-aae0-42d2-99aa-11b352ba7856",
    "organisationId": "1ec8939f-768e-41a1-a06e-711c064a4de8",
    "firstName": "Gerard",
    "surname": "Office One",
    "email": "gerard+office1@zailab.com",
    "roles": [
      "Office Employee"
    ],
    "extension": 10017,
    "devices": [
      {
        "name": "off13",
        "pin": "6891"
      }
    ]
  },
  {
    "memberId": "9fb3c8b5-122a-45cb-9d6d-a0b62140fc6a",
    "userId": "c3c42e49-4521-465a-b587-c0f1ab8cb356",
    "personId": "f67d6f90-d61d-4a75-b8be-a152e485b196",
    "organisationId": "1ec8939f-768e-41a1-a06e-711c064a4de8",
    "firstName": "Marcel",
    "surname": "Agent",
    "email": "marcel+agent@zailab.com",
    "roles": [
      "Agent"
    ],
    "extension": 10018,
    "devices": [
      {
        "name": "age183",
        "pin": "6595"
      }
    ]
  },
  {
    "memberId": "6d5ab97d-f490-4c98-9820-9ba566f57254",
    "userId": "c166bbab-3e99-47b0-a65a-7b280cab8043",
    "personId": "ec7445d8-57e9-468a-a8dc-911010b54ba6",
    "organisationId": "1ec8939f-768e-41a1-a06e-711c064a4de8",
    "firstName": "will",
    "surname": "coetsee",
    "email": "willen+009@zailab.com",
    "roles": [
      "Agent"
    ],
    "extension": 10019,
    "devices": [
      {
        "name": "coe26",
        "pin": "8644"
      }
    ]
  },
  {
    "memberId": "737ebd11-305d-45f7-9f5e-3a6ff798709f",
    "userId": "05b9df82-3165-474f-914b-8f7a6faf85d9",
    "personId": "2f6bfc6b-eaf1-4fc0-84d8-ef745fcbf5f6",
    "organisationId": "1ec8939f-768e-41a1-a06e-711c064a4de8",
    "firstName": "Willen",
    "surname": "Second",
    "email": "willen+005@zailab.com",
    "roles": [
      "Agent"
    ],
    "extension": 10020,
    "devices": [
      {
        "name": "sec2",
        "pin": "6416"
      }
    ]
  },
  {
    "memberId": "62418a1e-560b-4f39-81ad-3f2aa74bc6d4",
    "userId": "e4b1e13a-2527-4179-8823-3b37e17d4b3b",
    "personId": "2a89ec38-a05c-467e-b158-1da78130f401",
    "organisationId": "1ec8939f-768e-41a1-a06e-711c064a4de8",
    "firstName": "willen",
    "surname": "three",
    "email": "willen+008@zailab.com",
    "roles": [
      "Agent"
    ],
    "extension": 10021,
    "devices": [
      {
        "name": "thr21",
        "pin": "3335"
      }
    ]
  }
];
