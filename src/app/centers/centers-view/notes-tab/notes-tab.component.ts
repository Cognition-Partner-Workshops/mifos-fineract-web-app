/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AuthenticationService } from '../../../core/authentication/authentication.service';
import { CentersService } from '../../centers.service';
import { EntityNotesTabComponent } from '../../../shared/tabs/entity-notes-tab/entity-notes-tab.component';
import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'mifosx-notes-tab',
  templateUrl: './notes-tab.component.html',
  styleUrls: ['./notes-tab.component.scss'],
  imports: [
    ...STANDALONE_SHARED_IMPORTS,
    EntityNotesTabComponent
  ]
})
export class NotesTabComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private route = inject(ActivatedRoute);
  private authenticationService = inject(AuthenticationService);
  private centersService = inject(CentersService);

  entityId: string;
  username: string;
  entityNotes: any;

  constructor() {
    this.entityId = this.route.parent.parent.snapshot.params['centerId'];
    this.addNote = this.addNote.bind(this);
    this.editNote = this.editNote.bind(this);
    this.deleteNote = this.deleteNote.bind(this);
  }

  ngOnInit() {
    const savedCredentials = this.authenticationService.getCredentials();
    this.username = savedCredentials.username;
    this.route.data.pipe(takeUntil(this.destroy$)).subscribe((data: { centerNotes: any }) => {
      this.entityNotes = data.centerNotes;
    });
  }

  addNote(noteContent: any) {
    this.centersService
      .createCenterNote(this.entityId, noteContent)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        this.entityNotes.push({
          id: response.resourceId,
          createdByUsername: this.username,
          createdOn: new Date(),
          note: noteContent.note
        });
      });
  }

  editNote(noteId: string, noteContent: any, index: number) {
    this.centersService
      .editCenterNote(this.entityId, noteId, noteContent)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.entityNotes[index].note = noteContent.note;
      });
  }

  deleteNote(noteId: string, index: number) {
    this.centersService
      .deleteCenterNote(this.entityId, noteId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.entityNotes.splice(index, 1);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
