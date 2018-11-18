import { BrowserModule } from '@angular/platform-browser';
import { Component, OnInit, NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { PondManagementService } from '../pond-management/pond-management.service';
import { AppService } from '../app.service';
import { tokenName } from 'src/environments';
import * as jwtDecode from 'jwt-decode';
import { SeasionManagementService } from '../seasion-management/seasion-management.service';
import { MatSnackBar } from '@angular/material';

@Component({
    selector: 'app-using-veterinary',
    templateUrl: './using-veterinary.component.html',
    styleUrls: ['./using-veterinary.component.scss']
})
export class UsingVeterinaryComponent implements OnInit {

    token: string;
    ponds: any[] = [];
    ownerId: number;
    isBoss: boolean = false;
    seasons: any[] = [];
    seasonPresent: any = {};

    preloader: boolean = false;

    realSeasonPresent: any = {};
    checkSeasonPresent: boolean = true;

    constructor(
        private pondManagementService: PondManagementService,
        private seasionManagementService: SeasionManagementService,
        private router: Router,
        private appService: AppService,
        public snackBar: MatSnackBar
    ) {
        this.token = this.appService.getCookie(tokenName);
        const deToken: any = jwtDecode(this.token);
        this.ownerId = deToken.createdBy == null && deToken.roles.length == 0 ? deToken.userId : deToken.roles[0].bossId;
        if(deToken.userId === this.ownerId) {
            this.isBoss = true;
        }
    }

    ngOnInit() {
        if(this.isBoss){
            this.initBoss();
        } else {
            this.initEmp();
        }
    }

    initBoss() {
        this.getSeason();
    }

    initEmp() {
        this.getPond();
    }

    getSeason() {
        this.seasionManagementService.getSeasonWithOwner(this.token).subscribe(res => {
            if (res.success) {
                this.seasons = res.seasons;
                for(let i = 0; i < res.seasons.length;  i++) {
                    if(res.seasons[i].status === 0) {
                        this.seasonPresent = res.seasons[i]
                        this.realSeasonPresent = res.seasons[i]
                        break;
                    }
                    if(i === res.seasons.length - 1){
                        this.snackBar.open('Bạn không có vụ nào được kích hoạt, vui lòng kích hoạt một vụ mùa trong hệ thống.', 'Đóng', {
                            duration: 3000,
                            horizontalPosition: "center",
                            verticalPosition: 'top'
                        });
                        this.router.navigate['/quan-ly-chat-thai']
                    }
                }
                this.getAllPondWithSeasonUUId();
            } else {
                this.snackBar.open(res.message, 'Đóng', {
                    duration: 3000,
                    horizontalPosition: "center",
                    verticalPosition: 'top'
                });
            }
        })
    }

    goto(path) {
        this.router.navigate([path]);
    }

    getPond() {
        this.preloader = !this.preloader;
        this.pondManagementService.getPondAdvanced({
            image: true,
            isnotnull: true
        },this.token).subscribe(res => {
            if (res.success) {
                this.ponds = res.ponds;
                if(!res.ponds.length) {
                    this.snackBar.open('Không tìm thấy ao khả dụng.', 'Đóng', {
                        duration: 3000,
                        horizontalPosition: "center",
                        verticalPosition: 'top'
                    });
                }
            } else {
                this.snackBar.open(res.message, 'Đóng', {
                    duration: 3000,
                    horizontalPosition: "center",
                    verticalPosition: 'top'
                });
            }
            if(this.seasonPresent.seasonId !== this.realSeasonPresent.seasonId){
                this.checkSeasonPresent = false;
            } else {
                this.checkSeasonPresent = true;
            }
            this.preloader = !this.preloader;
        })
    }

    gotoAdd = (pondUUId: string) => {
        this.router.navigate(['/su-dung-thuoc-&-duoc-pham/them', pondUUId]);
    }

    changeSeason(season: any){
        this.seasonPresent = season;
        this.getAllPondWithSeasonUUId();
    }

    getAllPondWithSeasonUUId() {
        this.preloader = !this.preloader;
        this.pondManagementService.getPondAdvanced({
            image: true,
            isnotnull: true,
            seasonid: this.seasonPresent.seasonId
        }, this.token).subscribe(res => {
            if (res.success) {
                this.ponds = res.ponds;
                if(!res.ponds.length) {
                    this.snackBar.open('Không tìm thấy ao khả dụng.', 'Đóng', {
                        duration: 3000,
                        horizontalPosition: "center",
                        verticalPosition: 'top'
                    });
                }
            } else {
                this.snackBar.open(res.message, 'Đóng', {
                    duration: 3000,
                    horizontalPosition: "center",
                    verticalPosition: 'top'
                });
            }
            if(this.seasonPresent.seasonId !== this.realSeasonPresent.seasonId){
                this.checkSeasonPresent = false;
            } else {
                this.checkSeasonPresent = true;
            }
            this.preloader = !this.preloader;
        })
    }
}
