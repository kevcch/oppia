// Copyright 2021 The Oppia Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Unit tests for blog admin navbar component.
 */

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { UserService } from 'services/user.service';
import { BlogAdminNavbarComponent } from 'pages/blog-admin-page/navbar/blog-admin-navbar.component';
import { MockRouterModule } from 'hybrid-router-module-provider';
import { UserInfo } from 'domain/user/user-info.model';


describe('Blog Admin navbar component', () => {
  let component: BlogAdminNavbarComponent;
  let userService: UserService;
  let userProfileImage = 'profile-data-url';
  let userInfo = {
    getUsername: () => 'username1',
    isSuperAdmin: () => true
  };
  let profileUrl = '/profile/username1';
  let fixture: ComponentFixture<BlogAdminNavbarComponent>;
  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MockRouterModule
      ],
      declarations: [BlogAdminNavbarComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(BlogAdminNavbarComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    fixture.detectChanges();

    spyOn(userService, 'getProfileImageDataUrlAsync')
      .and.resolveTo(userProfileImage);
  }));

  it('should initialize component properties correctly', fakeAsync(() => {
    spyOn(userService, 'getUserInfoAsync')
      .and.resolveTo(userInfo as UserInfo);

    component.ngOnInit();
    tick();

    expect(component.profilePictureDataUrl).toBe(userProfileImage);
    expect(component.profileUrl).toBe(profileUrl);
    expect(component.profileDropdownIsActive).toBe(false);
  }));

  it('should throw error if username is invalid', fakeAsync(() => {
    let userInfo = {
      getUsername: () => null,
      isSuperAdmin: () => true
    };
    spyOn(userService, 'getUserInfoAsync')
      .and.resolveTo(userInfo as UserInfo);

    expect(() => {
      component.ngOnInit();
      tick();
    }).not.toThrowError('Cannot fetch username.');
  }));

  it('should set profileDropdownIsActive to true', fakeAsync(() => {
    spyOn(userService, 'getUserInfoAsync')
      .and.resolveTo(userInfo as UserInfo);

    component.ngOnInit();
    tick();

    expect(component.profileDropdownIsActive).toBe(false);

    component.activateProfileDropdown();

    expect(component.profileDropdownIsActive).toBe(true);
  }));

  it('should set profileDropdownIsActive to false', fakeAsync(() => {
    spyOn(userService, 'getUserInfoAsync')
      .and.resolveTo(userInfo as UserInfo);

    component.ngOnInit();
    tick();

    component.profileDropdownIsActive = true;

    expect(component.profileDropdownIsActive).toBe(true);

    component.deactivateProfileDropdown();

    expect(component.profileDropdownIsActive).toBe(false);
  }));
});
