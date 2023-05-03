import { ISettingItemRepository } from '../setting/ISettingItemRepository';
import { IEmailClient } from '../email/IEmailClient';
import { IGroupTagRepository } from '../group-tag/IGroupTagRepository';
import { IGroupRepository } from '../group/IGroupRepository';
import { IPageTagRepository } from '../page-tag/IPageTagRepository';
import { IPageRepository } from '../page/IPageRepository';
import { IPlaceRepository } from '../place/IPlaceRepository';
import { ISubjectCategoryRepository } from '../subject-category/ISubjectCategoryRepository';
import { ISubjectSemesterRepository } from '../subject-semester/ISubjectSemesterRepository';
import { ISubjectWeekRepository } from '../subject-week/ISubjectWeekRepository';
import { ISubjectRepository } from '../subject/ISubjectRepository';
import { ITeacherRepository } from '../teacher/ITeacherRepository';
import { IUserTagRepository } from '../user-tag/IUserTagRepository';
import { IUserRepository } from '../user/IUserRepository';

export interface IInfrastructures {
	userRepository: IUserRepository;
	groupRepository: IGroupRepository;
	pageRepository: IPageRepository;
	userTagRepository: IUserTagRepository;
	pageTagRepository: IPageTagRepository;
	groupTagRepository: IGroupTagRepository;
	subjectRepository: ISubjectRepository;
	subjectCategoryRepository: ISubjectCategoryRepository;
	subjectSemesterRepository: ISubjectSemesterRepository;
	subjectWeekRepository: ISubjectWeekRepository;
	settingItemRepository: ISettingItemRepository;
	placeRepository: IPlaceRepository;
	teacherRepository: ITeacherRepository;
	emailClient: IEmailClient;
}
