import { Injectable, MessageEvent } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SseService {
  private readonly subject = new Subject<{ event: string; data: any }>();

  stream(): Observable<MessageEvent> {
    return this.subject
      .asObservable()
      .pipe(map((payload) => ({ event: payload.event, data: payload.data })));
  }

  emit(event: string, data: any) {
    this.subject.next({ event, data });
  }
}
