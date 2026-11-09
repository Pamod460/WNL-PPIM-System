import {TestBed} from '@angular/core/testing';
import {provideHttpClient} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {AgentService} from './agent.service';
import {environment} from '../../../environments/environment';

describe('AgentService', () => {
  let service: AgentService;
  let backend: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AgentService, provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(AgentService);
    backend = TestBed.inject(HttpTestingController);
  });

  afterEach(() => backend.verify());

  it('verifies an agent with a POST of number and NIC to the API url', () => {
    service.verify('AG001', '200012345678').subscribe();
    const req = backend.expectOne(environment.api_url + '/agents/verify');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({number: 'AG001', nic: '200012345678'});
    req.flush({id: 1, number: 'AG001', fullName: 'Kamal Perera'});
  });
});
